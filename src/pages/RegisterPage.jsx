import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export function RegisterPage() {
  // 1. Adicionamos um novo estado para o nome completo
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      setLoading(false);
      return;
    }

    // 2. Modificamos a chamada ao Supabase para incluir o nome
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName // O Supabase irá passar este dado para o nosso "gatilho"
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Registo realizado! Verifique o seu email para confirmar a conta.');
      // Limpa todos os campos após o sucesso
      setFullName(''); // <-- Limpa o campo do nome
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-sm text-gray-600 mb-4">
        <span>Início</span> <span className="mx-2">›</span> <span>Minha Conta</span> <span className="mx-2">›</span> <span className="text-amber-800">Registe-se</span>
      </div>
      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Criar uma conta</h1>
        <p className="text-gray-600 mt-2">Compre mais rápido e acompanhe os seus pedidos num só lugar!</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-6">
        <div>
          <Label htmlFor="fullName">Nome completo</Label>
          {/* 3. Conectamos o input do nome completo ao seu estado */}
          <Input 
            id="fullName" 
            type="text" 
            placeholder="ex: Maria Perez" 
            required 
            className="mt-1"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="ex: seuemail@email.com.br" 
            required 
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone (opcional)</Label>
          <Input id="phone" type="tel" placeholder="ex: 11971923030" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input 
            id="password" 
            type="password" 
            placeholder="ex: suasenha" 
            required 
            className="mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
          <Input 
            id="confirmPassword" 
            type="password" 
            placeholder="ex: suasenha" 
            required 
            className="mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full bg-[#AB7D47] hover:bg-[#B8860B]" disabled={loading}>
          {loading ? 'A criar conta...' : 'Criar conta'}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Já possui uma conta?{" "}
          <Link to="/login" className="text-[#AB7D47] font-medium hover:underline">
            Iniciar sessão
          </Link>
        </p>
      </div>
    </main>
  );
}