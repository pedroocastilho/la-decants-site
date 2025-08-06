import React from 'react';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
// 1. Removemos 'LogOut' e 'Menu' que não são mais necessários aqui
import { Search, ShoppingCart, User, Instagram, Heart } from 'lucide-react'; 
import { FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import logo from '@/assets/la_decants_logo_optimized.png';
import { NavLink, Link } from 'react-router-dom'; // Removemos useNavigate
import { useAppContext } from '@/contexts/AppContext';
import { MobileMenu } from './MobileMenu';

export function Header({ onCartClick }) {
  // 2. Pegamos a 'session' e os outros dados do contexto. A função de logout foi removida.
  const { cartItemCount, favoritesCount, searchTerm, handleSearch, session } = useAppContext();

  return (
    <>
      {/* Header Superior (Frete Grátis) */}
      <div className="bg-[#AB7D47] text-white text-center py-2 text-sm">
        <div className="flex items-center justify-center gap-2">
          <span>FRETE GRÁTIS em compras acima de R$ 299,00</span>
        </div>
      </div>

      {/* Barra de Redes Sociais (mantendo suas cores) */}
      <div className="bg-[#F6F0E7] text-[#3b2712] py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <a href="https://www.instagram.com/ladecantsperfumaria/?igsh=OWMybzZyYXoxbmNy" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram className="w-5 h-5 cursor-pointer text-[#3b2712] hover:text-gray-400" />
            </a>
            <a href="https://www.tiktok.com/@la.decants?_t=ZM-8yJCDke0egw&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <SiTiktok className="w-5 h-5 cursor-pointer text-[#3b2712] hover:text-gray-400" />
            </a>
            <a href="https://wa.me/5542988340562" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp className="w-5 h-5 cursor-pointer text-[#3b2712] hover:text-gray-400" />
            </a>
          </div>
          <div className="text-sm">
            {/* Espaço para cupom, se desejar no futuro */}
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo e Menu Mobile */}
            <div className="flex items-center gap-2">
              <MobileMenu />
              <Link to="/" className="flex items-center">
                <img src={logo} alt="La Decants" className="h-14 w-14 sm:h-16 sm:w-16 mr-3" />
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold text-[#000000]">La Decants</h1>
                  <p className="text-sm text-gray-600">Perfumes e Fragrâncias</p>
                </div>
              </Link>
            </div>
            
            {/* Barra de Busca (escondida em ecrãs pequenos) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Buscar perfumes..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Ícones do Header */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* --- 3. AQUI ESTÁ A LÓGICA ATUALIZADA --- */}
              {session ? (
                // Se o usuário está logado, o ícone leva para a página de perfil
                <Link to="/perfil/dados" title="Minha Conta">
                  <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[#AB7D47]" />
                </Link>
              ) : (
                // Se não está logado, o ícone leva para a página de login
                <Link to="/login" title="Fazer Login">
                  <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[#AB7D47]" />
                </Link>
              )}
              
              <Link to="/favoritos" className="relative">
                <Heart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[#AB7D47]" />
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-[#AB7D47] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
              
              <div className="relative">
                <button onClick={onCartClick} aria-label="Abrir carrinho">
                  <ShoppingCart 
                    className="w-6 h-6 text-gray-600 cursor-pointer hover:text-[#AB7D47]" 
                  />
                </button>
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-[#AB7D47] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center pointer-events-none">
                    {cartItemCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação Principal (escondida em ecrãs pequenos) */}
      <nav className="hidden md:flex bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-3">
            <NavLink to="/" className={({ isActive }) => isActive ? "text-[#AB7D47] font-bold" : "text-gray-700 hover:text-black font-medium"}>INÍCIO</NavLink>
            <NavLink to="/masculinos" className={({ isActive }) => isActive ? "text-[#AB7D47] font-bold" : "text-gray-700 hover:text-black font-medium"}>MASCULINOS</NavLink>
            <NavLink to="/femininos" className={({ isActive }) => isActive ? "text-[#AB7D47] font-bold" : "text-gray-700 hover:text-black font-medium"}>FEMININOS</NavLink>
            <NavLink to="/arabes" className={({ isActive }) => isActive ? "text-[#AB7D47] font-bold" : "text-gray-700 hover:text-black font-medium"}>ÁRABES</NavLink>
            <NavLink to="/victorias-secret" className={({ isActive }) => isActive ? "text-[#AB7D47] font-bold" : "text-gray-700 hover:text-black font-medium"}>VICTORIA'S SECRET</NavLink>
            <NavLink to="/contato" className={({ isActive }) => isActive ? "text-[#AB7D47] font-bold" : "text-gray-700 hover:text-black font-medium"}>CONTATO</NavLink>
          </div>
        </div>
      </nav>
    </>
  )
}