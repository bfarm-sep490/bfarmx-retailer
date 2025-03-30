'use client';

import type {
  LoginFormTypes,
  LoginPageProps,
} from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  const { mutate: login } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const renderLink = (link: string, text?: string) => {
    return <ActiveLink to={link} className="text-sm text-primary hover:underline">{text}</ActiveLink>;
  };

  const renderProviders = () => {
    if (providers) {
      return (
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
              className="w-full"
            >
              {provider?.icon}
              <span className="ml-2">{provider.label}</span>
            </Button>
          ))}
        </div>
      );
    }
    return null;
  };

  const content = (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">
          {translate('pages.login.title', 'Đăng nhập')}
        </CardTitle>
        <CardDescription className="text-center">
          Nhập email và mật khẩu của bạn để đăng nhập
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <Label htmlFor="email-input">
                {translate('pages.login.fields.email', 'Email')}
              </Label>
              <Input
                id="email-input"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoCorrect="off"
                spellCheck={false}
                autoCapitalize="off"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-input">
                {translate('pages.login.fields.password', 'Mật khẩu')}
              </Label>
              <Input
                id="password-input"
                type="password"
                name="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              {rememberMe ?? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me-input"
                    checked={remember}
                    onCheckedChange={() => setRemember(!remember)}
                  />
                  <Label htmlFor="remember-me-input">
                    {translate('pages.login.buttons.rememberMe', 'Ghi nhớ đăng nhập')}
                  </Label>
                </div>
              )}
              {forgotPasswordLink
                ?? renderLink(
                  '/forgot-password',
                  translate(
                    'pages.login.buttons.forgotPassword',
                    'Quên mật khẩu?',
                  ),
                )}
            </div>
            <Button type="submit" className="w-full">
              {translate('pages.login.signin', 'Đăng nhập')}
            </Button>
          </form>

        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {registerLink ?? (
          <div className="text-sm text-center">
            {translate(
              'pages.login.buttons.noAccount',
              'Chưa có tài khoản?',
            )}
            {' '}
            {renderLink(
              '/register',
              translate('pages.login.register', 'Đăng ký'),
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div {...wrapperProps}>
      {renderContent ? renderContent(content, title) : content}
    </div>
  );
};
