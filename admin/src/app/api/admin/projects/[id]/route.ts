import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao deletar projeto' }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const data = await req.json();
    const updated = await prisma.project.update({
      where: { id: params.id },
      data
    });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao atualizar projeto' }, { status: 500 });
  }
}
