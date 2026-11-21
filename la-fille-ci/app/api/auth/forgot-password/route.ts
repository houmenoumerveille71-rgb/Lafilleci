import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  const start = Date.now();
  console.log('Forgot password request start');

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({
        message: 'Si ce compte existe, un lien de réinitialisation a été envoyé',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/nouveau-mot-de-passe?token=${resetToken}`;

    try {
      console.log('Email send start');
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'contact@lafilleci.com',
            to: email,
            subject: 'Réinitialisation de votre mot de passe - La Fille-Ci',
            html: `<h2>Réinitialisation de mot de passe</h2><p>Bonjour ${user.firstName || ''},</p><p>Vous avez demandé la réinitialisation de votre mot de passe sur La Fille-Ci.</p><p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p><a href="${resetUrl}" style="background:#d97706;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;">Réinitialiser mon mot de passe</a><p>Ce lien expire dans 1 heure.</p><p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>`,
          }),
        });
      } else {
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
      }
      console.log('Email send success', Date.now() - start);
    } catch (error) {
      console.error('Email send error:', error);
    }

    return NextResponse.json({
      message: 'Si ce compte existe, un lien de réinitialisation a été envoyé',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}
