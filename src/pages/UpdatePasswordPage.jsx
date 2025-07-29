import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha atualizada com sucesso!");
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Crie a sua Nova Senha</h1>
      </div>
      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <div>
          <Label htmlFor="password">Nova Senha</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
        </div>
        <Button type="submit" className="w-full bg-[#AB7D47] hover:bg-[#B8860B]" disabled={loading}>
          {loading ? 'A guardar...' : 'Guardar Nova Senha'}
        </Button>
      </form>
    </main>
  );
}