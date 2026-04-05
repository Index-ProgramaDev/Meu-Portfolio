"use client"
import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

export default function CTAAdmin() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ buttonText: '', link: '', helpText: '' });
  const [saved, setSaved] = useState(false);

  const fetchCTA = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/cta');
    const data = await res.json();
    if(data) setFormData(data);
    setLoading(false);
  };

  useEffect(() => { fetchCTA(); }, []);

  const handleSave = async () => {
    await fetch('/api/admin/cta', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return <div className="text-[#cca044] font-medium animate-pulse mt-8 flex items-center gap-2">Sincronizando banco de dados...</div>;

  return (
    <div className="max-w-3xl">
      <h2 className="text-3xl font-bold text-white tracking-tight mb-8">Personalize seu <span className="text-[#cca044]">Call To Action</span></h2>
      
      <div className="bg-[#111] p-8 rounded-2xl border border-[#222] shadow-2xl">
        <p className="text-gray-400 text-sm mb-6 border-b border-[#333] pb-4">Esta janela modifica as configurações do rodapé e a frase de chamamento do seu portfólio.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">Texto Auxiliar (Acima do botão)</label>
            <input 
              className="w-full bg-[#1a1a1a] border border-[#333] p-4 text-white rounded-xl focus:outline-none focus:border-[#cca044] transition-colors"
              value={formData.helpText} 
              onChange={e => setFormData({...formData, helpText: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">Texto do Botão Direto</label>
            <input 
              className="w-full bg-[#1a1a1a] border border-[#333] p-4 text-[#cca044] font-bold rounded-xl focus:outline-none focus:border-[#cca044] transition-colors"
              value={formData.buttonText} 
              onChange={e => setFormData({...formData, buttonText: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">Link de Destino (Ex: WhatsApp / Email)</label>
            <input 
              className="w-full bg-[#1a1a1a] border border-[#333] p-4 text-[#2a6bcc] rounded-xl focus:outline-none focus:border-[#cca044] tracking-wide transition-colors"
              value={formData.link} 
              onChange={e => setFormData({...formData, link: e.target.value})} 
            />
          </div>

          <div className="pt-6 border-t border-[#333] flex items-center justify-between">
            <button 
              onClick={handleSave} 
              className="flex items-center justify-center gap-3 bg-[#cca044] text-black w-full max-w-xs py-4 rounded-xl font-bold hover:bg-white transition-colors"
            >
              <Save size={20} /> Salvar Alterações
            </button>
            {saved && <span className="text-[#cca044] animate-pulse pr-4">Sucesso! Banco de Dados atualizado.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
