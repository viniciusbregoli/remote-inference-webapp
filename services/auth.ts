import { signOut } from 'next-auth/react';

export function logout(): void {
  if (typeof window === "undefined") return;
  signOut({ callbackUrl: '/login' });
}
