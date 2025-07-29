import { Instagram } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import logo from '@/assets/la_decants_logo_optimized.png'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <>
      {/* Seções Informativas */}
      <div className="bg-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Brindes Disponíveis</h3>
              <p className="text-gray-600 text-sm">
                Ganhe brindes incríveis junto com as suas compras na loja
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Frete Grátis</h3>
              <p className="text-gray-600 text-sm">
                Nós oferecemos diferentes condições de fretes especiais na loja
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg mb-2">Avise-me quando chegar</h3>
              <p className="text-gray-600 text-sm">
                Seja notificado quando seus produtos favoritos estiverem disponíveis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé Principal */}
      <footer className="bg-[#F6F0E7] text-black py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={logo} alt="La Decants" className="h-12 w-12 mr-3" />
              <h3 className="text-xl font-bold">La Decants</h3>
            </div>
            <p className="text-black mb-4">
              Sua loja de confiança para perfumes e fragrâncias de qualidade
            </p>
            <div className="flex justify-center gap-4">
              <a href="https://www.instagram.com/ladecantsperfumaria/?igsh=OWMybzZyYXoxbmNy" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram className="w-6 h-6 cursor-pointer text-black hover:text-gray-500" />
              </a>
              <a href="https://www.tiktok.com/@la.decants?_t=ZM-8yJCDke0egw&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <SiTiktok className="w-6 h-6 cursor-pointer text-black hover:text-gray-500" />
              </a>
              <a href="https://wa.me/5542988340562" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp className="w-6 h-6 cursor-pointer text-black hover:text-gray-500" />
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} La Decants | Todos os direitos reservados.</p>
            <p className="mt-2">
              Desenvolvido por  
              <a 
                href="https://wa.me/5542984393938" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-gray-600 hover:text-gray-400 transition-colors"
              >
                {' '}Pedro Castilho
              </a>
            </p>
          </div>
        </div>
      </footer>

    </>
  )
}