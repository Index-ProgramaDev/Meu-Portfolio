import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function DashboardPage() {
  const [totalProjects, metrics, ctaClicks] = await Promise.all([
    prisma.project.count(),
    prisma.visit.aggregate({ _avg: { duration: true }, _count: true }),
    prisma.event.count({ where: { type: 'btn_cta_click' } })
  ]);

  const avgSeconds = metrics._avg.duration || 0;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">
        Analytics <span className="text-[#cca044]">Overview</span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Projetos Ativos</p>
          <p className="text-4xl font-bold text-white shadow-sm">{totalProjects}</p>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Visitantes Únicos</p>
          <p className="text-4xl font-bold text-[#cca044]">{metrics._count}</p>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Cliques no CTA</p>
          <p className="text-4xl font-bold text-[#2a6bcc]">{ctaClicks}</p>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 shadow-xl">
          <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">Tempo Médio (Retenção)</p>
          <p className="text-4xl font-bold text-white">{avgSeconds.toFixed(1)} <span className="text-lg text-gray-500">segundos</span></p>
        </div>
        
      </div>
    </div>
  );
}
