import React from 'react';
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Separator } from "@/components/ui/separator";
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function PersonalDataPage() {
  const { session, profile, setProfile } = useAppContext();
  const [fullName, setFullName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Preenche o campo do nome quando o perfil é carregado
  React.useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date() })
      .eq('id', session.user.id);

    if (error) {
      toast.error("Não foi possível atualizar o perfil. Tente novamente.");
      console.error(error);
    } else {
      toast.success("Perfil atualizado com sucesso!");
      // Atualiza o estado local do perfil no AppContext
      setProfile(prev => ({ ...prev, full_name: fullName }));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dados Pessoais</h1>
        <p className="text-gray-500">Veja e edite as suas informações pessoais.</p>
      </div>
      
      <form onSubmit={handleUpdateProfile} className="border rounded-lg p-6 space-y-4">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={session?.user?.email || ''} disabled />
          <p className="text-xs text-gray-500 mt-1">O seu e-mail não pode ser alterado.</p>
        </div>
        <div>
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input 
            id="fullName" 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-[#AB7D47] hover:bg-[#B8860B]" disabled={loading}>
          {loading ? 'A guardar...' : 'Guardar Alterações'}
        </Button>
      </form>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-2">Sair</h2>
        <p className="text-sm text-gray-500 mb-4">Ao sair, você precisará de fazer login novamente para aceder à sua conta.</p>
        <LogoutButton />
      </div>
    </div>
  );
}