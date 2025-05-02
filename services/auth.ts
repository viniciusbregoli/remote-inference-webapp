export function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  return localStorage.getItem('accessToken');
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const token = getToken();
    return !!token; // Return true if token exists and is not null/undefined/empty
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

export function logout(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  // Redirect to login page
  window.location.href = '/login';
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    'Authorization': `Bearer ${token}`
  };
}