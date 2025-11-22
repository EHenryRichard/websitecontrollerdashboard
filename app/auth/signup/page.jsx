'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { showSuccess, showError, showPromise } from '../../utils/toast';
import { saveUser } from '../../utils/userService';
import { useAuth } from '../../contexts/AuthProvider';

export default function SignupPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      showError('Password must be at least 8 characters long');
      return;
    }

    // Validate password strength (at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      showError('Password must contain at least one letter and one number');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match!');
      return;
    }

    // Validate full name
    if (formData.name.trim().length < 2) {
      showError('Please enter your full name');
      return;
    }

    setIsLoading(true);

    // Prepare user data for API (using fullname instead of name)
    const userData = {
      fullname: formData.name,
      email: formData.email,
      password: formData.password,
    };

    // Use showPromise for loading, success, and error states
    showPromise(
      saveUser(userData),
      {
        loading: 'Creating your account...',
        success: (result) => {
          // Get success message from API response
          const successMessage = result?.message || result?.msg || 'Account created successfully!';

          // Redirect to dashboard after short delay
          // setTimeout(() => {
          //   router.push('/dashboard');
          // }, 1500);

          return successMessage;
        },
        error: (error) => {
          // Extract error message
          const errorMessage =
            typeof error === 'string'
              ? error
              : error?.message || 'Failed to create account. Please try again.';

          console.error('Signup error:', error);
          return errorMessage;
        },
      }
    ).finally(() => {
      setIsLoading(false);
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 shadow-2xl">
      {/* Logo/Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl text-white font-bold mb-2">
          Create Account
        </h1>
        <p className="text-gray-400 text-sm">
          Sign up to start managing your sites
        </p>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label className="block text-sm text-white font-medium mb-2">
            Full Name
          </label>
          <div className="relative">
            <FiUser
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <FiMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
              minLength={8}
              className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters with one letter and one number
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <FiLock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type={
                showConfirmPassword ? 'text' : 'password'
              }
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? (
                <FiEyeOff size={18} />
              ) : (
                <FiEye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div>
          <label className="flex items-start text-white gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              className="w-4 h-4 mt-0.5 rounded border-[#2a2a2a] bg-[#1a1a1a] text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-400">
              I agree to the{' '}
              <Link
                href="#"
                className="text-orange-500 hover:text-orange-400"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                className="text-orange-500 hover:text-orange-400"
              >
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#2a2a2a]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#111111] text-gray-400">
            or
          </span>
        </div>
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-orange-500 hover:text-orange-400 font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
