"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      const { error } = await res.json();
      setError(error || 'Falha no login');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#111] p-8 rounded-2xl border border-white/5 shadow-2xl">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Dashboard Login</h2>
        
        {error && <div className="mb-4 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm">{error}</div>}
        
        <input 
          type="email" 
          placeholder="Admin Email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#cca044] transition-colors"
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-[#cca044] transition-colors"
          required 
        />
        
        <button type="submit" className="w-full bg-[#cca044] text-black font-semibold py-3 rounded-lg hover:bg-white transition-colors">
          Entrar Seguramente
        </button>
      </form>
    </div>
  );
}
