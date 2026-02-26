'use client';

import type {
  RegisterPageProps,
} from '@refinedev/core';
import {
  useActiveAuthProvider,
  useLink,
  useRegister,
  useRouterContext,
  useRouterType,
  useTranslate,
} from '@refinedev/core';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type DivPropsType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type FormPropsType = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

type RegisterProps = RegisterPageProps<
  DivPropsType,
  DivPropsType,
  FormPropsType
>;

export const RegisterPage: React.FC<RegisterProps> = ({
  providers,
  loginLink,
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const translate = useTranslate();

  const authProvider = useActiveAuthProvider();
  const { mutate: register, isLoading } = useRegister({
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
                Hoặc đăng ký với
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {providers.map(provider => (
              <Button
                key={provider.name}
                variant="outline"
                onClick={() =>
                  register({
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
          {translate('pages.register.title', 'Đăng ký tài khoản')}
        </h1>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Tạo tài khoản mới để bắt đầu sử dụng dịch vụ
        </p>
      </div>

      {renderProviders()}

      {!hideForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            register({ ...mutationVariables, name, email });
          }}
          className="space-y-4"
          {...formProps}
        >
          <div className="space-y-2">
            <Label htmlFor="name-input" className="text-emerald-900 dark:text-emerald-100">
              {translate('pages.register.fields.name', 'Họ và tên')}
            </Label>
            <Input
              id="name-input"
              name="name"
              type="text"
              placeholder="Nguyễn Văn A"
              autoCorrect="off"
              spellCheck={false}
              autoCapitalize="off"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-input" className="text-emerald-900 dark:text-emerald-100">
              {translate('pages.register.fields.email', 'Email')}
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
          <div className="text-sm text-emerald-600 dark:text-emerald-400">
            Mật khẩu sẽ được gửi qua email của bạn. Vui lòng kiểm tra email để đăng nhập.
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            disabled={isLoading}
          >
            {isLoading
              ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
                )
              : (
                  translate('pages.register.buttons.submit', 'Đăng ký')
                )}
          </Button>
        </form>
      )}

      {loginLink ?? (
        <div className="text-sm text-center text-emerald-600 dark:text-emerald-400">
          {translate(
            'pages.login.buttons.haveAccount',
            'Đã có tài khoản?',
          )}
          {' '}
          {renderLink(
            '/login',
            translate('pages.login.signin', 'Đăng nhập'),
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
