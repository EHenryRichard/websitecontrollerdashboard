'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiCheckCircle, FiXCircle, FiLoader, FiMail } from 'react-icons/fi';
import { verifyMagicLink, resendVerification } from '../../utils/userService';
import { showPromise } from '../../utils/toast';

export default function MagicLinkTokenPage() {
  const router = useRouter();
  const params = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, resent
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [isExpired, setIsExpired] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);

  useEffect(() => {
    // Get token from URL params
    const token = params.token;

    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing verification link.');
      return;
    }

    setCurrentToken(token);
    // Verify the magic link
    verifyToken(token);
  }, [params]);

  // Countdown timer for redirect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.replace('/auth/login');
    }
  }, [status, countdown, router]);

  const verifyToken = async (token) => {
    try {
      // Call the API to verify the token
      const result = await verifyMagicLink(token);

      // Success
      setStatus('success');
      setMessage(result?.message || result?.msg || 'Email verified successfully!');
    } catch (error) {
      setStatus('error');

      // Check if token is expired (status 410 and code is 'EXPIRED')

      if (error?.status === 410 && error?.data?.code === 'EXPIRED') {
        setIsExpired(true);
        setIsNotFound(false);
        setMessage(error?.data?.error || 'This verification link has expired.');
      } else if (error?.status === 404) {
        // Handle 404 - user not found
        setIsNotFound(true);
        setIsExpired(false);
        setMessage(error?.data?.error || 'User not found. Please create a new account.');
      } else {
        setIsExpired(false);
        setIsNotFound(false);
        // Extract error message
        const errorMessage =
          typeof error === 'string'
            ? error?.error
            : error?.data?.error || 'Verification failed. The link may have expired.';

        setMessage(errorMessage);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!currentToken) return;

    showPromise(resendVerification(currentToken), {
      loading: 'Sending new verification link...',
      success: (result) => {
        // Update status to show resent message
        setStatus('resent');
        setMessage('A verification link has been sent to your email. Please check your inbox.');

        const successMessage =
          result?.message || result?.msg || 'Verification email sent! Please check your inbox.';
        return successMessage;
      },
      error: (error) => {
        const errorMessage =
          typeof error === 'string'
            ? error
            : error?.message || 'Failed to resend verification. Please try again.';
        return errorMessage;
      },
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Verification Card */}
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6 flex justify-center">
            {status === 'verifying' && (
              <div className="w-20 h-20 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center">
                <FiLoader className="text-orange-500 animate-spin" size={40} />
              </div>
            )}

            {status === 'success' && (
              <div className="w-20 h-20 bg-[#1a1a1a] border border-green-500/30 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-green-500" size={40} />
              </div>
            )}

            {status === 'error' && (
              <div className="w-20 h-20 bg-[#1a1a1a] border border-red-500/30 rounded-full flex items-center justify-center">
                <FiXCircle className="text-red-500" size={40} />
              </div>
            )}

            {status === 'resent' && (
              <div className="w-20 h-20 bg-[#1a1a1a] border border-orange-500/30 rounded-full flex items-center justify-center">
                <FiMail className="text-orange-500" size={40} />
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            {status === 'verifying' && 'Verifying your email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'resent' && 'Email Sent!'}
          </h1>

          {/* Message */}
          <p className="text-gray-400 text-sm mb-6">
            {status === 'verifying' && 'Please wait while we verify your email address.'}
            {status === 'success' && message}
            {status === 'error' && message}
            {status === 'resent' && message}
          </p>

          {/* Countdown / Action */}
          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                Redirecting to dashboard in{' '}
                <span className="text-orange-500 font-semibold">{countdown}</span> seconds...
              </p>
              <button
                onClick={() => router.replace('/auth/login')}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                Login Now
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              {isExpired ? (
                <>
                  <button
                    onClick={handleResendVerification}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <FiMail size={18} />
                    Resend Verification Email
                  </button>
                  {/* <button
                    onClick={() => router.push('/auth/login')}
                    className="w-full py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] rounded-lg font-semibold transition-colors text-white"
                  >
                    Back to Login
                  </button> */}
                </>
              ) : isNotFound ? (
                <>
                  <button
                    onClick={() => router.push('/auth/signup')}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
                  >
                    Create New Account
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
                  >
                    Back to Login
                  </button>
                  <button
                    onClick={() => router.push('/auth/signup')}
                    className="w-full py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] rounded-lg font-semibold transition-colors text-white"
                  >
                    Create New Account
                  </button>
                </>
              )}
            </div>
          )}

          {status === 'resent' && (
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">
                Please check your email and click the new verification link.
              </p>
              <button
                onClick={() => (window.location.href = 'mailto:')}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FiMail size={18} />
                Open Email App
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full py-3 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] rounded-lg font-semibold transition-colors text-white"
              >
                Go to Login
              </button>
            </div>
          )}

          {status === 'verifying' && (
            <div className="flex justify-center space-x-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.1s' }}
              ></span>
              <span
                className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-xs">
            Having trouble?{' '}
            <a href="/support" className="text-orange-500 hover:text-orange-400">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
