import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030303] text-white font-sans">
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col p-6">
        <h1 className="text-xl font-bold mb-10 text-[#cca044]">Index.Admin</h1>
        <nav className="flex-1 flex flex-col gap-2">
          <Link href="/admin" className="p-3 bg-white/5 rounded-lg hover:bg-[#cca044] hover:text-black transition-colors font-medium">Dashboard</Link>
          <Link href="/admin/projetos" className="p-3 rounded-lg hover:bg-white/10 transition-colors font-medium">Projetos</Link>
          <Link href="/admin/cta" className="p-3 rounded-lg hover:bg-white/10 transition-colors font-medium">Configurações CTA</Link>
        </nav>
        <a href="/api/auth/logout" className="block text-sm text-red-500 hover:text-red-400 text-left mt-auto font-medium pt-4 border-t border-[#1a1a1a]">
          Deslogar
        </a>
      </aside>
      <main className="flex-1 p-10 overflow-auto">{children}</main>
    </div>
  );
}
