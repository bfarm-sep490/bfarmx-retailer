'use client';

import type {
  ForgotPasswordFormTypes,
  ForgotPasswordPageProps,
} from '@refinedev/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import {
  useForgotPassword,
  useLink,
  useRouterContext,
  useRouterType,
  useTranslate,
} from '@refinedev/core';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type DivPropsType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type FormPropsType = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

type ForgotPasswordProps = ForgotPasswordPageProps<
  DivPropsType,
  DivPropsType,
  FormPropsType
>;

export const ForgotPasswordPage: React.FC<ForgotPasswordProps> = ({
  loginLink,
  wrapperProps,
  renderContent,
  formProps,
  title = undefined,
  mutationVariables,
}) => {
  const translate = useTranslate();
  const router = useRouter();
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const ActiveLink = routerType === 'legacy' ? LegacyLink : Link;

  const { mutate: forgotPassword, isLoading, isSuccess }
    = useForgotPassword<ForgotPasswordFormTypes>();

  React.useEffect(() => {
    if (isSuccess) {
      setIsSuccessModalOpen(true);
    }
  }, [isSuccess]);

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    router.push('/login');
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

  const content = (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {translate('pages.forgotPassword.title', 'Quên mật khẩu')}
        </h1>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          forgotPassword({ ...mutationVariables, email });
        }}
        className="space-y-4"
        {...formProps}
      >
        <div className="space-y-2">
          <Label htmlFor="email-input" className="text-emerald-900 dark:text-emerald-100">
            {translate('pages.forgotPassword.fields.email', 'Email')}
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
        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          disabled={isLoading}
        >
          {isLoading
            ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              )
            : (
                translate('pages.forgotPassword.buttons.submit', 'Gửi')
              )}
        </Button>
      </form>

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

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Kiểm tra email của bạn"
        message="Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn."
        buttonText="Quay lại đăng nhập"
        onButtonClick={handleSuccessModalClose}
      />
    </div>
  );

  return (
    <div {...wrapperProps}>
      {renderContent ? renderContent(content, title) : content}
    </div>
  );
};
