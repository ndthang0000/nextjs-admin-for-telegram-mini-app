'use client';

export const getTokenFromLocalStorage = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};