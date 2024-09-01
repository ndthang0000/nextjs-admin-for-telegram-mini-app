'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ResponseApi } from './types';
import { getTokenFromLocalStorage } from '@/lib/utils';

export interface InterfaceLogin {
  email: string;
  password: string;
}

export interface InterfaceUpdateManager {
  managerId: string;
  password?: string;
  isBlock?: boolean;
  role?: string;
  email?: string;
  name?: string;
}

export const loginSlice = createApi({
  reducerPath: 'loginApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,
  }), // Adjust the base URL as needed
  endpoints: (builder) => ({
    login: builder.mutation<ResponseApi<any>, InterfaceLogin>({
      query: (dto) => ({
        url: '/admin/auth/login', // The endpoint for the POST request
        method: 'POST',
        body: dto,
      }),
    }),
    updateManager: builder.mutation<ResponseApi<any>, InterfaceUpdateManager>({
      query: ({ managerId, ...dto }) => ({
        url: '/admin/auth/update-manager/' + managerId, // The endpoint for the POST request
        headers: {
          'Authorization': 'Bearer ' + getTokenFromLocalStorage(),
        },
        method: 'POST',
        body: dto,
      }),
    }),
  }),
  // Add more endpoints as needed
});

export const { useLoginMutation, useUpdateManagerMutation } = loginSlice;
