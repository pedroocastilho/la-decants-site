import { NavLink, Outlet, useLocation } from "react-router-dom";
import { User, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfilePage() {
  const location = useLocation();
  const isRootProfile = location.pathname === '/perfil';

  // Componente para os links do menu para evitar repetição de código
  const MenuLink = ({ to, icon, label }) => (
    <NavLink
      to={to}
      end // 'end' garante que o link só fica ativo na sua página exata
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100",
          (isActive || (isRootProfile && to === '/perfil/dados')) && "bg-gray-100 font-semibold text-black"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Coluna da Esquerda: Menu de Navegação */}
        <div className="md:col-span-1">
          <nav className="grid gap-2 text-sm font-medium">
            <MenuLink to="/perfil/dados" icon={<User className="h-4 w-4" />} label="Dados Pessoais" />
            <MenuLink to="/perfil/enderecos" icon={<MapPin className="h-4 w-4" />} label="Endereços" />
            <MenuLink to="/perfil/pedidos" icon={<Package className="h-4 w-4" />} label="Meus Pedidos" />
          </nav>
        </div>

        {/* Coluna da Direita: Conteúdo da Secção */}
        <div className="md:col-span-3">
          {/* O Outlet irá renderizar as sub-páginas (Dados, Endereços, Pedidos) */}
          <Outlet />
        </div>
      </div>
    </main>
  );
}