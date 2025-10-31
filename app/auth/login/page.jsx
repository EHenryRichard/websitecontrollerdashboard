'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add actual authentication logic here
    console.log('Login:', formData);

    // For now, just redirect to dashboard
    router.push('/dashboard');
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
        <h1 className="text-3xl font-bold mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium mb-2">
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
          <label className="block text-sm font-medium mb-2">
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
              placeholder="Enter your password"
              required
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
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-[#2a2a2a] bg-[#1a1a1a] text-orange-500 focus:ring-orange-500 focus:ring-offset-0"
            />
            <span className="text-sm text-gray-400">
              Remember me
            </span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-orange-500 hover:text-orange-400"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
        >
          Sign In
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

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-orange-500 hover:text-orange-400 font-semibold"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}
