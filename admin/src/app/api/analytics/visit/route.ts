import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, userAgent } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const ipHash = Buffer.from(ip).toString('base64').substring(0, 16);

    const visit = await prisma.visit.create({
      data: {
        sessionId,
        ipHash,
        userAgent,
      }
    });

    return NextResponse.json({ success: true, visitId: visit.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao registrar visita' }, { status: 500 });
  }
}
