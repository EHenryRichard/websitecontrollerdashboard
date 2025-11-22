'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthProvider';

export default function MagicLoginPage() {
  const router = useRouter();
  const params = useParams();
  const { magicLogin } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Get validation ID from URL params
    const id = params.validationId;

    if (!id) {
      setStatus('error');
      setMessage('Invalid or missing validation link.');
      return;
    }

    // Automatically verify the token
    verifyToken(id);
  }, [params]);

  // Countdown timer for redirect
  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      router.replace('/dashboard');
    }
  }, [status, countdown, router]);

  const verifyToken = async (validationId) => {
    try {
      // Call the AuthProvider's magicLogin function
      const result = await magicLogin(validationId);

      // Success
      setStatus('success');
      setMessage(result?.message || result?.msg || 'Login successful!');
    } catch (error) {
      setStatus('error');

      // Extract error message
      const errorMessage =
        typeof error === 'string'
          ? error
          : error?.message || error?.data?.error || 'Invalid or expired verification link.';

      setMessage(errorMessage);
    }
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
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            {status === 'verifying' && 'Verifying your login...'}
            {status === 'success' && 'Login Successful!'}
            {status === 'error' && 'Verification Failed'}
          </h1>

          {/* Message */}
          <p className="text-gray-400 text-sm mb-6">
            {status === 'verifying' && 'Please wait while we verify your login link.'}
            {status === 'success' && message}
            {status === 'error' && message}
          </p>

          {/* Countdown / Action */}
          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                Redirecting to dashboard in{' '}
                <span className="text-orange-500 font-semibold">{countdown}</span> seconds...
              </p>
              <button
                onClick={() => router.replace('/dashboard')}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
              >
                Go to Dashboard Now
              </button>
            </div>
          )}

          {status === 'error' && (
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              Back to Login
            </button>
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
      </div>
    </div>
  );
}
