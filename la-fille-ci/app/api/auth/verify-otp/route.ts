import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { phone, otp, newPassword } = await request.json();
    if (!phone || !otp || !newPassword) {
      return NextResponse.json({ error: 'Champs requis' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user || !user.resetToken || !user.resetTokenExpires) {
      return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
    }

    if (new Date() > user.resetTokenExpires) {
      return NextResponse.json({ error: 'Code expiré' }, { status: 400 });
    }

    const valid = await bcrypt.compare(otp, user.resetToken);
    if (!valid) {
      return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpires: null },
    });

    return NextResponse.json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
