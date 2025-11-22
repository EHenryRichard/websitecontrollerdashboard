'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiAlertCircle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { verifyResetToken } from '../../utils/userService';

export default function VerifyResetTokenPage() {
  const router = useRouter();
  const params = useParams();
  const [verificationState, setVerificationState] = useState('verifying'); // 'verifying', 'valid', 'invalid'
  const [errorMessage, setErrorMessage] = useState('');
  const token = params?.token;

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerificationState('invalid');
        setErrorMessage('No reset token provided');
        return;
      }

      try {
        // Verify the token with the backend
        await verifyResetToken(token);

        // Token is valid, show success and redirect
        setVerificationState('valid');

        // Redirect to the change password page after 2 seconds
        setTimeout(() => {
          router.push(`/auth/reset-password?token=${token}`);
        }, 2000);
      } catch (error) {
        console.error('Token verification error:', error);
        setVerificationState('invalid');

        const errorMsg = typeof error === 'string'
          ? error
          : error?.message || 'The reset link is invalid or has expired';

        setErrorMessage(errorMsg);
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Verifying State */}
        {verificationState === 'verifying' && (
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
        )}

        {/* Valid State */}
        {verificationState === 'valid' && (
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
                <FiCheckCircle className="text-green-500" size={32} />
              </div>
              <h1 className="text-2xl text-white font-bold mb-2">Link Verified!</h1>
              <p className="text-gray-400 text-sm mb-6">
                Your reset link is valid. Redirecting you to change your password...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FiLoader className="animate-spin" size={16} />
                <span>Redirecting...</span>
              </div>
            </div>
          </div>
        )}

        {/* Invalid State */}
        {verificationState === 'invalid' && (
          <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-6">
                <FiAlertCircle className="text-red-500" size={32} />
              </div>
              <h1 className="text-2xl text-white font-bold mb-2">Invalid Reset Link</h1>
              <p className="text-gray-400 text-sm mb-6">
                {errorMessage || 'The password reset link is invalid or has expired.'}
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
        )}
      </div>
    </div>
  );
}
