// src/pages/LoginPage.jsx
import React from 'react'; // Importamos o React
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom"; // 1. Importamos o useNavigate
import { supabase } from '@/lib/supabaseClient'; // Importamos o Supabase
import { toast } from 'sonner';

export function LoginPage() {
  const navigate = useNavigate(); // 2. Inicializamos o hook de navegação

  // 3. Criamos os estados para os campos e para o carregamento
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // 4. Criamos a função de login
  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Usamos a função de login do Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      if (error.message === 'Invalid login credentials') {
        toast.error('E-mail ou senha inválidos. Por favor, tente novamente.');
      } else {
        toast.error(error.message); // Mostra outros erros que possam acontecer
      }
    } else {
      toast.success('Login bem-sucedido!');
      navigate('/'); 
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-sm text-gray-600 mb-4">
        <span>Início</span> <span className="mx-2">›</span> <span>Minha Conta</span> <span className="mx-2">›</span> <span className="text-amber-800">Login</span>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Iniciar sessão</h1>
      </div>

      <form onSubmit={handleSignIn} className="space-y-6">
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

        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-[#AB7D47] hover:underline">
            Esqueceu a sua senha?
          </Link>
        </div>

        <Button type="submit" className="w-full bg-[#AB7D47] hover:bg-[#B8860B]" disabled={loading}>
          {loading ? 'A entrar...' : 'Iniciar sessão'}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Não possui uma conta ainda?{" "}
          <Link to="/register" className="text-[#AB7D47] font-medium hover:underline">
            Criar uma conta
          </Link>
        </p>
      </div>
    </main>
  );
}