import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const backendUrl =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5001';

const handler = NextAuth({
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

        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();
          // Adjust based on your backend response structure
          // We expect { userId: string, email: string }
          if (data && data.userId) {
            return {
              id: data.userId,
              email: data.email || email,
              name: data.email || email,
            };
          }
          return null;
        } catch (e) {
          console.error('Auth error:', e);
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
});

export { handler as GET, handler as POST };
