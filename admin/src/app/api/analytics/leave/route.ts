import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, duration } = await req.json();

    if (!sessionId || duration == null) {
       return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }

    const visit = await prisma.visit.findFirst({
      where: { sessionId },
      orderBy: { startedAt: 'desc' }
    });

    if (visit) {
        await prisma.visit.update({
            where: { id: visit.id },
            data: { duration }
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao registrar saída' }, { status: 500 });
  }
}
