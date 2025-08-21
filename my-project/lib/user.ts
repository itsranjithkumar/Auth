// Simple user util for demo. Replace with real auth/session logic as needed.
export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) return JSON.parse(user);
  }
  return null;
}
