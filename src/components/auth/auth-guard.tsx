'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { setAdmin } from '@/redux/slice/admin-slice';
import axiosInstance from '@/lib/axios-instance';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { admin, isLoading } = useAppSelector((state) => state.admin);

  const checkPermissions = async (): Promise<void> => {
    if (!admin.email) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const checkToken = await axiosInstance.get('/admin/auth/check-token')
          if (checkToken.status) {
            dispatch(setAdmin(checkToken.data));
          }
        } catch (error) {
          router.push(paths.auth.signIn);
        }
      }
      else {
        logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
        router.push(paths.auth.signIn);
        return;
      }
    }

  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
    });
  }, [admin.email]);

  if (isLoading) {
    return <Alert color="info">Loading...</Alert>;
  }

  if (!admin.email) {
    return <Alert color="error">Loi</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
