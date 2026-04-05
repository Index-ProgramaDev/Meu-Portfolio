import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL('/login', req.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete('admin_token');
  return response;
}
