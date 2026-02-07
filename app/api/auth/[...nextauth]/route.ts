import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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
        if (!email || typeof email !== 'string') return null;
        try {
          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim() }),
          });
          if (!res.ok) return null;
          const data = (await res.json()) as { userId: string };
          return { id: data.userId, email: email.trim(), name: email.trim() };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.id = token.sub ?? '';
      return session;
    },
  },
  pages: { signIn: '/' },
});

export { handler as GET, handler as POST };
