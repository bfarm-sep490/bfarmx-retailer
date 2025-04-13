'use client';

import type { AuthProvider } from '@refinedev/core';
import axios from 'axios';
import Cookies from 'js-cookie';

export const TOKEN_KEY = 'bfarmx-auth';
export const USER_KEY = 'bfarmx-user';

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
const mockUsers = [
  {
    email: 'admin@bfarmx.com',
    password: '123456',
    name: 'ackerman',
    avatar: 'https://i.pravatar.cc/150?img=1',
    roles: ['admin'],
  },
];

export const authProviderClient: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await authApiClient.post('/auth/login', {
        email,
        password,
      });

      if (response.data.status === 200) {
        const { accessToken } = response.data.data;

        Cookies.set(TOKEN_KEY, accessToken, {
          expires: 7,
          path: '/',
        });

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
          name: 'Invalid response from server',
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
    const user = mockUsers.find(item => item.email === params.email);

    if (user) {
      Cookies.set('auth', JSON.stringify(user), {
        expires: 30, // 30 days
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
        message: 'Register failed',
        name: 'Invalid email or password',
      },
    };
  },
  forgotPassword: async (params) => {
    const user = mockUsers.find(item => item.email === params.email);

    if (user) {
      return {
        success: true,
      };
    }
    return {
      success: false,
      error: {
        message: 'Forgot password failed',
        name: 'Invalid email',
      },
    };
  },
  updatePassword: async (params) => {
    const isPasswordInvalid = params.password === '123456' || !params.password;

    if (isPasswordInvalid) {
      return {
        success: false,
        error: {
          message: 'Update password failed',
          name: 'Invalid password',
        },
      };
    }

    return {
      success: true,
    };
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
