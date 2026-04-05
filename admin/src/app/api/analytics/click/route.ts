import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, type } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    
    const ipHash = Buffer.from(ip).toString('base64').substring(0, 16);

    await prisma.event.create({
      data: {
        type,
        sessionId,
        ipHash,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao registrar evento' }, { status: 500 });
  }
}
