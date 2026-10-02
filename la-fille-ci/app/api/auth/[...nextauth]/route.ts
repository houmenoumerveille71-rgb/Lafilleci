import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SessionStrategy } from 'next-auth';

interface JWTData {
  id?: number;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  isAdmin?: boolean;
}

interface SessionData {
  user?: {
    id?: number;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
    isAdmin?: boolean;
  };
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'Compte',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy
  },
  pages: {
    signIn: '/login',
    signUp: '/register'
  },
  callbacks: {
    async jwt({ token, user }: { token: JWTData; user: { id?: string; email?: string; firstName?: string | null; lastName?: string | null; isAdmin?: boolean } | null }) {
      if (user) {
        token.id = Number(user.id);
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }: { session: SessionData; token: JWTData }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
