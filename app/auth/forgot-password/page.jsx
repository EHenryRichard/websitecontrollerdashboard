'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { showError, showPromise } from '../../utils/toast';
import { requestPasswordReset } from '../../utils/userService';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    showPromise(requestPasswordReset(formData.email), {
      loading: 'Sending reset email...',
      success: (result) => {
        setEmailSent(true);
        return result?.message || result?.msg || 'Password reset email sent successfully!';
      },
      error: (error) => {
        const errorMessage =
          typeof error === 'string'
            ? error
            : error?.message || 'Failed to send reset email. Please try again.';

        console.error('Forgot password error:', error);
        return errorMessage;
      },
    }).finally(() => {
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
      {/* Back to Login Link */}
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors mb-6"
      >
        <FiArrowLeft size={16} />
        Back to Login
      </Link>

      {/* Logo/Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl text-white font-bold mb-2">
          {emailSent ? 'Check Your Email' : 'Forgot Password?'}
        </h1>
        <p className="text-gray-400 text-sm">
          {emailSent
            ? "We've sent a password reset link to your email address"
            : "No worries! Enter your email and we'll send you reset instructions"}
        </p>
      </div>

      {!emailSent ? (
        <>
          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2a]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#111111] text-gray-400">or</span>
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
        </>
      ) : (
        <>
          {/* Success Message */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 mb-6">
            <p className="text-gray-300 text-sm text-center mb-4">
              We sent a password reset link to{' '}
              <span className="text-orange-500 font-semibold">
                {formData.email}
              </span>
            </p>
            <p className="text-gray-400 text-xs text-center">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setEmailSent(false)}
                className="text-orange-500 hover:text-orange-400 underline"
              >
                try another email address
              </button>
            </p>
          </div>

          {/* Return to Login Button */}
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
          >
            Return to Login
          </button>
        </>
      )}
    </div>
  );
}
