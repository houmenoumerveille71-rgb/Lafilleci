import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: {
      id?: number;
      email?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      isAdmin?: boolean;
    };
  }
}
