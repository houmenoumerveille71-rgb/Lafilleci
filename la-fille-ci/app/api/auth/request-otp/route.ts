import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ error: 'Numéro requis' }, { status: 400 });

    const user = await prisma.user.findFirst({ where: { phone } });
    // Ne pas révéler si le numéro existe
    if (!user) {
      return NextResponse.json({ message: 'Si ce numéro existe, un code a été envoyé' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashed, resetTokenExpires: expires },
    });

    // TODO: envoyer le SMS via e-MC (en attente de documentation)
    console.log('OTP generated for', phone);

    return NextResponse.json({ message: 'Si ce numéro existe, un code a été envoyé' });
  } catch (error) {
    console.error('Request OTP error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
