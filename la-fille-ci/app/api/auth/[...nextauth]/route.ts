import NextAuth, { type NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Le typage explicite `NextAuthOptions` est indispensable : il permet a
// `getServerSession(authOptions)` d'inferer le type `Session` augmentation
// (voir types/next-auth.d.ts). Sans lui, `session.user` est type `{}`.
export const authOptions: NextAuthOptions = {
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
    strategy: 'jwt',
  },
  pages: {
    // Seuls `signIn`, `error` et `verifyRequest` sont supportes par next-auth v4.
    // La page d'inscription /register est geree independamment par l'application.
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // `authorize` renvoie un id de type string, on le convertit en nombre
        // car `token.id` est type `number` (voir types/next-auth.d.ts).
        token.id = Number(user.id);
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
