'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Pagination, ResponseApi } from './types';
import { Customer } from '@/components/dashboard/customer/customers-table';
import { getTokenFromLocalStorage } from '@/lib/utils';
import queryString from 'query-string';

export interface UserQuery {
  userId?: string;
  username?: string;
  limit: number;
  page: number;
  sortBy?: string
}

export interface UpdateUserPayload {
  userId: string;
  isBlock?: boolean;
}


export interface ResponseUserList extends Pagination {
  results: Customer[];
}



export const userSlice = createApi({
  reducerPath: 'userUser',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT,
    headers: {
      'Authorization': 'Bearer ' + getTokenFromLocalStorage(),
    }
  }), // Adjust the base URL as needed
  endpoints: (builder) => ({
    fetchUser: builder.query<ResponseUserList, UserQuery>({
      query: (dto) => ({
        url: '/admin/user/get-user?' + queryString.stringify(dto), // The endpoint for the POST request
        method: 'GET',
        query: dto,
      }),
    }),
    updateUser: builder.mutation<ResponseApi<Customer>, UpdateUserPayload>({
      query: (dto) => ({
        url: '/admin/user/update-user/' + dto.userId, // The endpoint for the POST request
        method: 'POST',
        body: { isBlock: dto.isBlock },
      }),
    }),
    exportUser: builder.query<ResponseApi<string>, void>({
      query: (dto) => ({
        url: '/admin/user/export',  // The endpoint for the POST request
        method: 'GET',
      }),
    }),
  }),
  // Add more endpoints as needed
});

export const { useFetchUserQuery, useUpdateUserMutation, useLazyExportUserQuery } = userSlice;
