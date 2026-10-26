import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou pas (sécurité)
      return NextResponse.json({
        message: 'Si ce compte existe, un lien de réinitialisation a été envoyé',
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 heure

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Construire le lien de réinitialisation
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/nouveau-mot-de-passe?token=${resetToken}`;

    // Tenter d'envoyer un email si configuré
    try {
      const { transporter } = await import('@/lib/email');
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@lafille-ci.com',
        to: email,
        subject: 'Réinitialisation de votre mot de passe - La Fille-Ci',
        html: `
          <h2>Réinitialisation de mot de passe</h2>
          <p>Bonjour ${user.firstName || ''},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe sur La Fille-Ci.</p>
          <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
          <a href="${resetUrl}" style="background:#d97706;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;">Réinitialiser mon mot de passe</a>
          <p>Ce lien expire dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        `,
      });
    } catch {
      // Si l'envoi d'email échoue, on continue quand même (le lien est stocké en DB)
      console.log('Reset link (development):', resetUrl);
    }

    return NextResponse.json({
      message: 'Si ce compte existe, un lien de réinitialisation a été envoyé',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}
