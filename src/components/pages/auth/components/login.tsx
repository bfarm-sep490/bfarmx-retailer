'use client';

import type {
  LoginFormTypes,
  LoginPageProps,
} from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useActiveAuthProvider,
  useLink,
  useLogin,
  useRouterContext,
  useRouterType,
  useTranslate,
} from '@refinedev/core';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type DivPropsType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type FormPropsType = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

type LoginProps = LoginPageProps<DivPropsType, DivPropsType, FormPropsType>;

export const LoginPage: React.FC<LoginProps> = ({
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
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const translate = useTranslate();

  useEffect(() => {
    const rememberedEmail = Cookies.get('remembered_email');
    const rememberedPassword = Cookies.get('remembered_password');

    if (rememberedEmail && rememberedPassword) {
      setEmail(rememberedEmail);
      setPassword(rememberedPassword);
      setRemember(true);
    }
  }, []);

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

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
            login({ ...mutationVariables, email, password, remember });
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
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            disabled={isLoading}
          >
            {isLoading
              ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                )
              : (
                  translate('pages.login.signin', 'Đăng nhập')
                )}
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
