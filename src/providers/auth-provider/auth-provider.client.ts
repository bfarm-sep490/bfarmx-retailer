'use client';

import type { AuthProvider } from '@refinedev/core';
import axios from 'axios';
import Cookies from 'js-cookie';

export const TOKEN_KEY = 'bfarmx-retail-auth';
export const USER_KEY = 'bfarmx-retail-user';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.bfarmx.space/api';
const authApiClient = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
    'accept': 'text/plain',
  },
});
function safelyDecodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join(''),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = safelyDecodeJwt(token);
  if (!payload || !payload.exp) {
    return true;
  }

  // Convert current time to seconds (Unix timestamp)
  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = payload.exp;

  return currentTime >= expirationTime;
}

export const authProviderClient: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await authApiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data.status === 200) {
        const { accessToken } = response.data.data;

        const tokenPayload = safelyDecodeJwt(accessToken);

        if (!tokenPayload) {
          return {
            success: false,
            error: {
              message: 'Failed to decode token',
              name: 'Token decode error',
            },
          };
        }

        // Check if user role is Retailer
        const userRole = tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        if (userRole !== 'Retailer') {
          return {
            success: false,
            error: {
              message: 'Access denied',
              name: 'Only Retailer accounts are allowed to access this application',
            },
          };
        }

        Cookies.set(TOKEN_KEY, accessToken, {
          expires: 7,
          path: '/',
        });

        const userInfo = {
          id: tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
          name: tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
          email: tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
          role: tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
          avatar: tokenPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri'],
        };

        Cookies.set(USER_KEY, JSON.stringify(userInfo), {
          expires: 7,
          path: '/',
        });

        return {
          success: true,
          redirectTo: '/',
        };
      }

      return {
        success: false,
        error: {
          message: 'Login failed',
          name: 'Password or email is incorrect',
        },
      };
    } catch (error) {
      const errorMessage
        = (axios.isAxiosError(error) && error.response?.data?.message)
          || 'Login failed. Please check your credentials.';

      return {
        success: false,
        error: {
          message: 'Login failed',
          name: errorMessage,
        },
      };
    }
  },
  register: async (params) => {
    try {
      const response = await authApiClient.post('/retailers', {
        email: params.email,
        name: params.name,
      });

      if (response.status === 200) {
        return {
          success: true,
          redirectTo: '/login',
        };
      }

      return {
        success: false,
        error: {
          message: 'Đăng ký thất bại',
          name: 'Lỗi từ máy chủ',
        },
      };
    } catch (error) {
      const errorMessage
        = (axios.isAxiosError(error) && error.response?.data?.message)
          || 'Đăng ký thất bại. Vui lòng thử lại sau.';

      return {
        success: false,
        error: {
          message: 'Đăng ký thất bại',
          name: errorMessage,
        },
      };
    }
  },
  forgotPassword: async (params) => {
    try {
      const response = await authApiClient.post('/auth/password-forgotten', null, {
        params: {
          email: params.email,
        },
      });

      if (response.status === 200) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: {
          message: 'Gửi yêu cầu thất bại',
          name: 'Lỗi từ máy chủ',
        },
      };
    } catch (error) {
      const errorMessage
        = (axios.isAxiosError(error) && error.response?.data?.message)
          || 'Gửi yêu cầu thất bại. Vui lòng thử lại sau.';

      return {
        success: false,
        error: {
          message: 'Gửi yêu cầu thất bại',
          name: errorMessage,
        },
      };
    }
  },
  updatePassword: async (params: any) => {
    try {
      const response = await authApiClient.put(`/auth/${params.userId}/password`, {
        old_password: params.oldPassword,
        new_password: params.newPassword,
      });

      if (response.status === 200) {
        return {
          success: true,
          redirectTo: '/login',
        };
      }

      return {
        success: false,
        error: {
          message: 'Cập nhật mật khẩu thất bại',
          name: 'Lỗi từ máy chủ',
        },
      };
    } catch (error) {
      const errorMessage
        = (axios.isAxiosError(error) && error.response?.data?.message)
          || 'Cập nhật mật khẩu thất bại. Vui lòng thử lại sau.';

      return {
        success: false,
        error: {
          message: 'Cập nhật mật khẩu thất bại',
          name: errorMessage,
        },
      };
    }
  },
  logout: async () => {
    Cookies.remove(TOKEN_KEY, { path: '/' });
    Cookies.remove(USER_KEY, { path: '/' });
    return {
      success: true,
      redirectTo: '/auth/login',
    };
  },
  check: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      if (isTokenExpired(token)) {
        // Token is expired, remove it and redirect to login
        Cookies.remove(TOKEN_KEY, { path: '/' });
        Cookies.remove(USER_KEY, { path: '/' });
        return {
          authenticated: false,
          logout: true,
          redirectTo: '/auth/login',
        };
      }
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: '/auth/login',
    };
  },
  getPermissions: async () => {
    const userInfo = Cookies.get(USER_KEY);
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      return parsedUser.role;
    }
    return null;
  },
  getIdentity: async () => {
    try {
      const userStr = Cookies.get(USER_KEY);

      if (!userStr) {
        return null;
      }

      const user = JSON.parse(userStr);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || 'https://i.pravatar.cc/150',
      };
    } catch (error) {
      console.error('Error getting identity:', error);
      return null;
    }
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
