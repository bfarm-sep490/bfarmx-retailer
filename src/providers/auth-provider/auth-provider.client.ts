'use client';

import type { AuthProvider } from '@refinedev/core';
import Cookies from 'js-cookie';

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
  login: async ({ email, password, remember }) => {
    const user = mockUsers.find(item => item.email === email && item.password === password);

    if (user) {
      if (remember) {
        Cookies.set('remembered_email', email, {
          expires: 30, // 30 days
          path: '/',
        });
        Cookies.set('remembered_password', password, {
          expires: 30, // 30 days
          path: '/',
        });
      } else {
        Cookies.remove('remembered_email', { path: '/' });
        Cookies.remove('remembered_password', { path: '/' });
      }

      const { password: _, ...userWithoutPassword } = user;
      Cookies.set('auth', JSON.stringify(userWithoutPassword), {
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
        name: 'LoginError',
        message: 'Email hoặc mật khẩu không chính xác',
      },
    };
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
    Cookies.remove('auth', { path: '/' });
    return {
      success: true,
      redirectTo: '/auth/login',
    };
  },
  check: async () => {
    const auth = Cookies.get('auth');
    if (auth) {
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
    const auth = Cookies.get('auth');
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get('auth');
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser;
    }
    return null;
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
