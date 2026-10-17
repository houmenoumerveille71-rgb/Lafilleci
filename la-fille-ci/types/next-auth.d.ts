import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  // Champs supplementaires portes par la table User du schema Prisma.
  // `id` n'est pas redefini : next-auth impose `id: string` pour l'objet
  // renvoye par le callback `authorize` (l'id numerique est converti plus loin).
  interface User {
    firstName?: string | null;
    lastName?: string | null;
    isAdmin?: boolean;
  }

  // `Session` est le type utilise par `getServerSession` dans l'application :
  // on y ajoute l'id numerique de la table User et le role isAdmin.
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

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    isAdmin?: boolean;
  }
}
