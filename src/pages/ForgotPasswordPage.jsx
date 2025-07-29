import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Se o email estiver registado, receberá um link para redefinir a sua senha.');
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Redefinir Senha</h1>
        <p className="text-gray-600 mt-2">Insira o seu email para receber um link de redefinição.</p>
      </div>
      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
        </div>
        <Button type="submit" className="w-full bg-[#AB7D47] hover:bg-[#B8860B]" disabled={loading}>
          {loading ? 'A enviar...' : 'Enviar Link'}
        </Button>
      </form>
    </main>
  );
}