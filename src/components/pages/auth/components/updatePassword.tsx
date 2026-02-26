'use client';

import type {
  UpdatePasswordPageProps,
} from '@refinedev/core';
import {
  useActiveAuthProvider,
  useLogin,
  useTranslate,
  useUpdatePassword,
} from '@refinedev/core';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';

type DivPropsType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type FormPropsType = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

type UpdatePasswordProps = UpdatePasswordPageProps<
  DivPropsType,
  DivPropsType,
  FormPropsType
>;

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

export const UpdatePasswordPage: React.FC<UpdatePasswordProps> = ({
  wrapperProps,
  renderContent,
  formProps,
  title = undefined,
}) => {
  const translate = useTranslate();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [tokenData, setTokenData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = safelyDecodeJwt(token);
      if (decoded && decoded.Purpose === 'ResetPassword') {
        setTokenData(decoded);
      } else {
        setError('Token không hợp lệ hoặc đã hết hạn');
      }
    } else {
      setError('Không tìm thấy token');
    }
  }, [token]);

  const authProvider = useActiveAuthProvider();
  const { mutate: updatePassword, isLoading: isUpdating }
    = useUpdatePassword<any>({
      v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });

  const { mutate: login, isLoading: isLoggingIn } = useLogin<any>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    if (tokenData && token) {
      updatePassword(
        {
          userId: tokenData.nameid,
          oldPassword: tokenData.jti,
          newPassword,
        } as any,
        {
          onSuccess: () => {
            setIsSuccessModalOpen(true);
            // Auto login with new password
            login({
              email: tokenData.sub,
              password: newPassword,
            });
          },
        },
      );
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    router.push('/');
  };

  if (error) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
          {error}
        </h1>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Vui lòng yêu cầu liên kết đặt lại mật khẩu mới
        </p>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const content = (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {translate('pages.updatePassword.title', 'Đặt lại mật khẩu')}
        </h1>
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Vui lòng nhập mật khẩu mới cho tài khoản
          {' '}
          {tokenData.sub}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        {...formProps}
      >
        <div className="space-y-2">
          <Label htmlFor="password-input" className="text-emerald-900 dark:text-emerald-100">
            {translate('pages.updatePassword.fields.password', 'Mật khẩu mới')}
          </Label>
          <Input
            id="password-input"
            name="password"
            type="password"
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500 dark:focus:ring-emerald-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password-input" className="text-emerald-900 dark:text-emerald-100">
            {translate('pages.updatePassword.fields.confirmPassword', 'Xác nhận mật khẩu mới')}
          </Label>
          <Input
            id="confirm-password-input"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="border-emerald-200 dark:border-emerald-800 focus:ring-emerald-500 dark:focus:ring-emerald-400"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          disabled={isUpdating || isLoggingIn}
        >
          {isUpdating || isLoggingIn
            ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              )
            : (
                translate('pages.updatePassword.buttons.submit', 'Cập nhật mật khẩu')
              )}
        </Button>
      </form>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={handleSuccessModalClose}
        title="Đổi mật khẩu thành công"
        message="Mật khẩu của bạn đã được cập nhật thành công. Bạn sẽ được chuyển hướng về trang chủ."
        buttonText="Đóng"
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
