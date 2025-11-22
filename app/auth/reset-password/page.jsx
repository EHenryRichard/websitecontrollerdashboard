'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { showError, showPromise } from '../../utils/toast';
import { resetPassword, verifyResetToken } from '../../utils/userService';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState('');
  const [userid, setUserid] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract token from URL query params and verify it
  useEffect(() => {
    if (!mounted) return;

    const verifyToken = async () => {
      const tokenFromUrl = searchParams.get('token');

      if (!tokenFromUrl) {
        showError('Invalid or missing reset token');
        setIsVerifying(false);
        return;
      }

      setToken(tokenFromUrl);

      try {
        // Verify the token with the backend
        const verificationResult = await verifyResetToken(tokenFromUrl);

        // Extract userid from the response
        const userId = verificationResult?.data?.userid;
        if (!userId) {
          throw new Error('User ID not found in verification response');
        }

        // Store userid and mark token as valid
        setUserid(userId);
        setIsTokenValid(true);
        setIsVerifying(false);
      } catch (error) {
        console.error('Token verification error:', error);

        const errorMessage =
          typeof error === 'string'
            ? error
            : error?.message || 'The reset link is invalid or has expired';

        showError(errorMessage);
        setIsTokenValid(false);
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [searchParams, mounted]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  // Show loading state while verifying token
  if (isVerifying) {
    return (
      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-full mb-6">
            <FiLoader className="text-blue-500 animate-spin" size={32} />
          </div>
          <h1 className="text-2xl text-white font-bold mb-2">Verifying Reset Link</h1>
          <p className="text-gray-400 text-sm">
            Please wait while we verify your password reset token...
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate userid exists
    if (!userid) {
      showError('Invalid or missing user ID');
      return;
    }

    // Validate password
    if (formData.password.length < 8) {
      showError('Password must be at least 8 characters long');
      return;
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    // Check password strength (optional: add more validation)
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      showError('Password must contain uppercase, lowercase, and number');
      return;
    }

    setIsLoading(true);

    showPromise(resetPassword(userid, formData.password), {
      loading: 'Resetting your password...',
      success: (result) => {
        // Redirect to login after successful password reset
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
        return (
          result?.message || result?.msg || 'Password reset successfully! Redirecting to login...'
        );
      },
      error: (error) => {
        const errorMessage =
          typeof error === 'string'
            ? error
            : error?.message || 'Failed to reset password. The link may have expired.';

        console.error('Reset password error:', error);
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

  // Show error if token is invalid
  if (!isTokenValid) {
    return (
      <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl text-white font-bold mb-2">Invalid Reset Link</h1>
          <p className="text-gray-400 text-sm mb-6">
            The password reset link is invalid or has expired.
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/forgot-password"
              className="block w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors text-center"
            >
              Request New Reset Link
            </Link>
            <Link
              href="/auth/login"
              className="block w-full py-3 px-6 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] rounded-lg font-semibold transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl text-white font-bold mb-2">Reset Password</h1>
        <p className="text-gray-400 text-sm">Enter your new password below</p>
      </div>

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Password Field */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">New Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              suppressHydrationWarning
              className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              suppressHydrationWarning
              className="w-full pl-10 pr-12 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg focus:outline-none focus:border-orange-500 text-gray-300 placeholder-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !userid}
          suppressHydrationWarning
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
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
          Remember your password?{' '}
          <Link href="/auth/login" className="text-orange-500 hover:text-orange-400 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
