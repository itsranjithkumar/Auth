import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";
export interface User {
  email: string;
  [key: string]: any;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  async function refreshUser() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const data = jwtDecode(token);
        // DEBUG: Log the decoded token and raw token
        console.log('Decoded user from JWT:', data);
        console.log('Raw JWT token:', token);
        // Try to get avatar from JWT or fallback to Gravatar
        // Type guards for JWT fields
        let email = (data as any).email || (data as any).sub || "";
        let avatar = (data as any).avatar;
        // Try to get avatar from localStorage if not present in JWT
        if (!avatar) {
          avatar = typeof window !== "undefined" ? localStorage.getItem("avatar") || undefined : undefined;
        }
        if (!avatar && email) {
          const hash = window.crypto?.subtle ? await (async () => {
            const msgUint8 = new TextEncoder().encode(email.trim().toLowerCase());
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
            return Array.from(new Uint8Array(hashBuffer)).map(x => x.toString(16).padStart(2, '0')).join('');
          })() : '';
          avatar = hash ? `https://www.gravatar.com/avatar/${hash}?d=identicon` : undefined;
        }
        setUser({ ...data, email, avatar } as User);
      } catch (err) {
        setUser(null);
        console.error('JWT decode error:', err);
      }
    } else {
      setUser(null);
      console.warn('No JWT token found in localStorage');
    }
  }

  useEffect(() => {
    refreshUser();
    window.addEventListener("storage", refreshUser);
    return () => window.removeEventListener("storage", refreshUser);
  }, []);

  useEffect(() => {
    refreshUser();
  }, [pathname]);

  return user;
}


