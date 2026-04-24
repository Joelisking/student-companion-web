import { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        const backendUrl =
          process.env.BACKEND_URL || 'http://localhost:5001';

        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const body = await res.text().catch(() => '');
            console.error(`Login failed: ${res.status} ${res.statusText}`, body);
            return null;
          }

          const data = await res.json();
          if (data && data.userId) {
            return {
              id: data.userId,
              email: data.email || email,
              name: data.name || data.email || email,
            };
          }
          return null;
        } catch (e) {
          console.error('Auth error — could not reach backend at', backendUrl, e);
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: { signIn: '/login' },
};
