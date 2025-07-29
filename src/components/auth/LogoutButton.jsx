import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Sessão encerrada com sucesso!');
    navigate('/'); // Redireciona para a home após o logout
  };

  return (
    <Button variant="outline" onClick={handleSignOut} className="w-full justify-start">
      <LogOut className="w-4 h-4 mr-2" />
      Sair da Conta
    </Button>
  );
}