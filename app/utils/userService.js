import axiosInstance from './axiosInstance';

/**
 * Save a new user (signup/register)
 * @param {Object} userData - User data object
 * @param {string} userData.fullname - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise} Response from the API
 */
export const saveUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/users/saveUser', {
      fullname: userData.fullname,
      email: userData.email,
      password: userData.password,
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    // Re-throw the error with more context if needed
    throw error.response?.data || error.message || 'Failed to save user';
  }
};

/**
 * Verify magic link token
 * @param {string} token - The verification token from the magic link
 * @returns {Promise} Response from the API
 */
export const verifyMagicLink = async (token) => {
  try {
    const response = await axiosInstance.get(`/users/magic_link/${token}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    return response.data;
  } catch (error) {
    // Re-throw the error with more context if needed
    throw error?.response;
  }
};

/**
 * Resend verification email
 * @param {string} token - The expired token ID
 * @returns {Promise} Response from the API
 */
export const resendVerification = async (token) => {
  try {
    const response = await axiosInstance.post(`/users/resend-verification/${token}`);
    console.log('Resend verification response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Resend verification error:', error);
    // Re-throw the error with more context if needed
    throw error.response?.data || error.message || 'Failed to resend verification';
  }
};

/**
 * Request new verification email by email address (for 404 errors)
 * @param {string} email - User's email address
 * @returns {Promise} Response from the API
 */
export const requestVerificationByEmail = async (email) => {
  try {
    const response = await axiosInstance.post('/users/resend-verification', {
      email: email,
    });
    console.log('Request verification response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Request verification error:', error);
    // Re-throw the error with more context if needed
    throw error.response?.data || error.message || 'Failed to request verification';
  }
};

/**
 * Login user (sends verification email)
 * @param {Object} loginData - Login credentials
 * @param {string} loginData.email - User's email address
 * @param {string} loginData.password - User's password
 * @returns {Promise} Response from the API
 */
export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post('/users/login', {
      email: loginData.email,
      password: loginData.password,
    });
    console.log('Login response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    // Re-throw the error with more context if needed
    throw error.response?.data || error.message || 'Failed to login';
  }
};

/**
 * Verify login validation token
 * NOTE: This function is deprecated. Use AuthProvider.magicLogin() instead.
 * Kept for backward compatibility.
 * @param {string} validationId - The validation ID from the login magic link
 * @returns {Promise} Response from the API (includes access token, refresh token, and user data)
 */
export const verifyLoginToken = async (validationId) => {
  try {
    const response = await axiosInstance.get(`/users/login-verify/${validationId}`, {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });

    // No longer storing in localStorage - use AuthProvider.magicLogin() instead
    return response.data;
  } catch (error) {
    console.log(error);

    // Re-throw the error with more context if needed
    throw error?.response;
  }
};

/**
 * Request password reset
 * @param {string} email - User's email address
 * @returns {Promise} Response from the API
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axiosInstance.post('users/forgot-password', {
      email: email,
    });

    return response.data;
  } catch (error) {
    // Re-throw the error with more context if needed
    throw error.response?.data || error.message || 'Failed to send password reset email';
  }
};

/**
 * Verify reset password token validity
 * @param {string} token - Password reset token from the email link
 * @returns {Promise} Response from the API
 */
export const verifyResetToken = async (token) => {
  try {
    const response = await axiosInstance.get(`users/reset-password/${token}`);

    return response.data;
  } catch (error) {
    // Re-throw the error with more context if needed
    throw error.response?.data || error.message || 'Invalid or expired reset token';
  }
};

/**
 * Reset password with userid and new password
 * @param {string} userid - User ID from token verification
 * @param {string} newPassword - New password to set
 * @returns {Promise} Response from the API
 */
export const resetPassword = async (userid, newPassword) => {
  try {
    const response = await axiosInstance.post('users/reset-password', {
      id: userid,
      password: newPassword,
    });

    return response.data;
  } catch (error) {
    // Re-throw the error with more context if needed
    throw error.response?.data || error.message || 'Failed to reset password';
  }
};
