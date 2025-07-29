import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import React from 'react';

export function MobileMenu() {
  // Estado para controlar se o menu está aberto ou fechado
  const [isOpen, setIsOpen] = React.useState(false);

  // Função para fechar o menu ao clicar num link
  const closeMenu = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden"> {/* Só aparece em ecrãs menores que 'md' */}
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs">
        <div className="flex flex-col h-full">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-lg font-semibold">Menu</h2>
          </div>
          <nav className="flex flex-col space-y-4">
            <NavLink to="/" onClick={closeMenu} className={({isActive}) => `text-lg ${isActive ? 'text-[#AB7D47]' : 'text-gray-700'}`}>INÍCIO</NavLink>
            <NavLink to="/masculinos" onClick={closeMenu} className={({isActive}) => `text-lg ${isActive ? 'text-[#AB7D47]' : 'text-gray-700'}`}>MASCULINOS</NavLink>
            <NavLink to="/femininos" onClick={closeMenu} className={({isActive}) => `text-lg ${isActive ? 'text-[#AB7D47]' : 'text-gray-700'}`}>FEMININOS</NavLink>
            <NavLink to="/arabes" onClick={closeMenu} className={({isActive}) => `text-lg ${isActive ? 'text-[#AB7D47]' : 'text-gray-700'}`}>ÁRABES</NavLink>
            <NavLink to="/victorias-secret" onClick={closeMenu} className={({isActive}) => `text-lg ${isActive ? 'text-[#AB7D47]' : 'text-gray-700'}`}>VICTORIA'S SECRET</NavLink>
            <NavLink to="/contato" onClick={closeMenu} className={({isActive}) => `text-lg ${isActive ? 'text-[#AB7D47]' : 'text-gray-700'}`}>CONTATO</NavLink>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}