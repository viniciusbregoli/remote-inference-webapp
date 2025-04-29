// Authentication service

/**
 * Check if user is logged in
 * @returns boolean indicating if user is logged in
 */
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const token = localStorage.getItem('accessToken');
    return !!token; // Return true if token exists and is not null/undefined/empty
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

  /**
   * Get the user's access token
   * @returns The access token or null if not logged in
   */
  export function getToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem('accessToken');
  }

  /**
   * Log the user out
   */
  export function logout(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('accessToken');
    // Redirect to login page
    window.location.href = '/login';
  }

  /**
   * Get Authorization header with token
   * @returns Object with Authorization header or empty object if not logged in
   */
  export function getAuthHeader(): Record<string, string> {
    const token = getToken();

    if (!token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${token}`
    };
  }