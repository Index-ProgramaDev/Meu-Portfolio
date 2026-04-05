"use client"
import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';

export default function ProjetosAdmin() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', image: '', link: '', order: 0 });

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/projects');
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (id: string | null = null) => {
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/admin/projects/${id}` : '/api/admin/projects';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    setIsEditing(null);
    setFormData({ title: '', description: '', image: '', link: '', order: 0 });
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este projeto permanentemente?')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    fetchProjects();
  };

  const startEdit = (p: any) => {
    setIsEditing(p.id);
    setFormData(p);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight">Gerenciar <span className="text-[#cca044]">Projetos</span></h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing('new')}
            className="flex items-center gap-2 bg-[#cca044] text-black px-4 py-2 rounded-lg font-bold hover:bg-white transition"
          >
            <Plus size={20} /> Novo Projeto
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-[#111] p-6 rounded-xl border border-[#333] mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-white mb-4">{isEditing === 'new' ? 'Cadastrar Novo Projeto' : 'Editar Projeto'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Título (ex: E-commerce SaaS)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#cca044]" />
            <input placeholder="Ordem de Ranking (ex: 1)" type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white focus:outline-none focus:border-[#cca044]" />
            <input placeholder="URL da Imagem (Pode usar URLs da web ou o caminho './Midia/foto.png')" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white md:col-span-2 focus:outline-none focus:border-[#cca044]" />
            <input placeholder="Link do Projeto (https://...)" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white md:col-span-2 focus:outline-none focus:border-[#cca044]" />
            <textarea placeholder="Descrição curta do projeto..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white md:col-span-2 min-h-[100px] focus:outline-none focus:border-[#cca044]" />
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => handleSave(isEditing === 'new' ? null : isEditing)} className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-[#cca044] transition"><Save size={18} /> Salvar</button>
            <button onClick={() => { setIsEditing(null); setFormData({ title: '', description: '', image: '', link: '', order: 0 }); }} className="flex items-center gap-2 bg-transparent text-gray-400 border border-gray-600 px-6 py-2 rounded-lg hover:text-white transition"><X size={18} /> Cancelar</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-[#cca044] font-medium animate-pulse flex items-center gap-2">Carregando projetos de alta performance...</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-500 flex flex-col items-center justify-center py-20 border border-dashed border-[#333] rounded-xl bg-[#0a0a0a]">
            Nada aqui! Lance seu primeiro projeto usando o botão acima.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map(p => (
            <div key={p.id} className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl flex flex-col md:flex-row gap-6 items-center hover:border-white/20 transition group shadow-sm">
              <div className="w-40 h-24 bg-[#1a1a1a] rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center relative border border-white/5">
                <img src={p.image?.startsWith('http') ? p.image : '/file-solid.svg'} alt="thumbnail" className="object-cover w-full h-full opacity-60 group-hover:opacity-100 transition duration-500" />
              </div>
              <div className="flex-1 text-left w-full">
                <h4 className="text-xl font-bold text-white mb-1">{p.title}</h4>
                <p className="text-sm text-gray-400 line-clamp-2 md:pr-10">{p.description}</p>
                <div className="text-xs text-gray-600 mt-3 flex items-center gap-4">
                  <span className="bg-[#222] px-2 py-1 rounded">Rank: {p.order}</span>
                  <a href={p.link} target="_blank" className="text-[#cca044] hover:underline flex items-center gap-1">Visitar URL</a>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 justify-end md:justify-center">
                <button onClick={() => startEdit(p)} className="p-3 text-gray-400 hover:text-white bg-[#1a1a1a] border border-[#333] hover:border-white/50 rounded-lg transition"><Edit3 size={18} /></button>
                <button onClick={() => handleDelete(p.id)} className="p-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 bg-[#1a1a1a] border border-[#333] hover:border-red-500/50 rounded-lg transition"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
