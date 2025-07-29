import { useAppContext } from "@/contexts/AppContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { session } = useAppContext();

  // Se não houver uma sessão ativa, redireciona o utilizador para a página de login
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Se houver uma sessão, mostra o conteúdo da página solicitada (neste caso, o perfil)
  return <Outlet />;
}