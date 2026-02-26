'use client';

import type {
  LoginFormTypes,
  LoginPageProps,
} from '@refinedev/core';
import type {
  DetailedHTMLProps,
  FC,
  FormHTMLAttributes,
  HTMLAttributes,
} from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  TOKEN_KEY,
  USER_KEY,
} from '@/providers/auth-provider/auth-provider.client';
import {
  useActiveAuthProvider,
  useLink,
  useLogin,
  useRouterContext,
  useRouterType,
  useTranslate,
} from '@refinedev/core';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DivPropsType = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type FormPropsType = DetailedHTMLProps<
  FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

type LoginProps = LoginPageProps<DivPropsType, DivPropsType, FormPropsType>;

const DUMMY_EMAIL = 'demo.retailer@bfarmx.local';
const DUMMY_PASSWORD = 'Demo@123456';
const DUMMY_USER = {
  id: 'offline-retailer',
  name: 'Offline Retailer',
  email: DUMMY_EMAIL,
  role: 'Retailer',
  avatar: 'https://i.pravatar.cc/150?img=12',
};

export const LoginPage: FC<LoginProps> = ({
  providers,
  registerLink,
  forgotPasswordLink,
  rememberMe,
  wrapperProps,
  renderContent,
  formProps,
  title = undefined,
  hideForm,
  mutationVariables,
}) => {
  const routerType = useRouterType();
  const router = useRouter();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link;

  const [remember, setRemember] = useState(false);

  const translate = useTranslate();

  const authProvider = useActiveAuthProvider();
  const { mutate: login } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const encodeBase64Url = (value: object) => {
    return window
      .btoa(JSON.stringify(value))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const createDummyToken = () => {
    const header = encodeBase64Url({
      alg: 'HS256',
      typ: 'JWT',
    });
    const payload = encodeBase64Url({
      exp: 4102444800,
      role: 'Retailer',
    });

    return `${header}.${payload}.offline-signature`;
  };

  const handleOfflineLogin = () => {
    const token = createDummyToken();

    Cookies.set(TOKEN_KEY, token, {
      expires: 7,
      path: '/',
    });
    Cookies.set(USER_KEY, JSON.stringify(DUMMY_USER), {
      expires: 7,
      path: '/',
    });

    router.push('/');
  };

  const renderLink = (link: string, text?: string) => {
    return (
      <ActiveLink
        to={link}
        className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors"
      >
        {text}
      </ActiveLink>
    );
  };

  const renderProviders = () => {
    if (providers) {
      return (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-200 dark:border-emerald-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-emerald-600 dark:text-emerald-400">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {providers.map(provider => (
              <Button
                key={provider.name}
                variant="outline"
                onClick={() =>
                  login({
                    ...mutationVariables,
                    providerName: provider.name,
                  })}
                className="w-full border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
              >
                {provider?.icon}
                <span className="ml-2">{provider.label}</span>
              </Button>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const content = (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {translate('pages.login.title', 'Đăng nhập')}
        </h1>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Nhập email và mật khẩu của bạn để đăng nhập
        </p>
      </div>

      {renderProviders()}

      {!hideForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOfflineLogin();
          }}
          className="space-y-4"
          {...formProps}
        >
          <div className="space-y-2">
            <Label htmlFor="email-input" className="text-emerald-900 dark:text-emerald-100">
              {translate('pages.login.fields.email', 'Email')}
            </Label>
            <Input
              id="email-input"
              name="email"
              type="email"
              placeholder="bfarmx@gmail.com"
              autoCorrect="off"
              spellCheck={false}
              autoCapitalize="off"
              required
              value={DUMMY_EMAIL}
              readOnly
              className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password-input" className="text-emerald-900 dark:text-emerald-100">
                {translate('pages.login.fields.password', 'Mật khẩu')}
              </Label>
              {forgotPasswordLink
                ?? renderLink(
                  '/auth/forgot-password',
                  translate(
                    'pages.login.buttons.forgotPassword',
                    'Quên mật khẩu?',
                  ),
                )}
            </div>
            <Input
              id="password-input"
              type="password"
              name="password"
              required
              value={DUMMY_PASSWORD}
              readOnly
              className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            />
          </div>
          {rememberMe ?? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me-input"
                checked={remember}
                onCheckedChange={() => setRemember(!remember)}
                className="border-emerald-200 dark:border-emerald-800"
              />
              <Label htmlFor="remember-me-input" className="text-sm text-emerald-900 dark:text-emerald-100">
                {translate('pages.login.buttons.rememberMe', 'Ghi nhớ đăng nhập')}
              </Label>
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            {translate('pages.login.signin', 'Đăng nhập')}
          </Button>
        </form>
      )}

      {registerLink ?? (
        <div className="text-sm text-center text-emerald-600 dark:text-emerald-400">
          {translate(
            'pages.login.buttons.noAccount',
            'Chưa có tài khoản?',
          )}
          {' '}
          {renderLink(
            '/auth/register',
            translate('pages.login.register', 'Đăng ký'),
          )}
        </div>
      )}
    </div>
  );

  return (
    <div {...wrapperProps}>
      {renderContent ? renderContent(content, title) : content}
    </div>
  );
};
