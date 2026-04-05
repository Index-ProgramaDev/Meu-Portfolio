import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json(projects, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao carregar projetos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, description, image, link, order } = await req.json();
    const newProject = await prisma.project.create({
      data: { title, description, image, link, order: order || 0 }
    });
    return NextResponse.json(newProject);
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao salvar projeto' }, { status: 500 });
  }
}
