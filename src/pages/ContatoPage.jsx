import { Mail, MapPin } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export function ContatoPage() {
  const address = "Rua 21 de setembro, 487 - São Mateus do Sul - PR - 83900122";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-sm text-gray-600 mb-4">
        <span>Início</span> <span className="mx-2">›</span> <span className="text-[#AB7D47]">Contato</span>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Contato</h1>

      <div className="space-y-6">
        {/* WhatsApp */}
        <a href="https://wa.me/5542988340562" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
          <FaWhatsapp className="w-6 h-6 text-gray-700" />
          <span className="text-lg text-gray-800 group-hover:text-[#AB7D47] transition-colors">
            (42) 98834-0562
          </span>
        </a>

        {/* E-mail */}
        <a href="mailto:decantsperfumesss@gmail.com" className="flex items-center gap-4 group">
          <Mail className="w-6 h-6 text-gray-700" />
          <span className="text-lg text-gray-800 group-hover:text-[#AB7D47] transition-colors">
            decantsperfumesss@gmail.com
          </span>
        </a>

        {/* Endereço */}
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
          <MapPin className="w-6 h-6 text-gray-700 mt-1 flex-shrink-0" />
          <span className="text-lg text-gray-800 group-hover:text-[#AB7D47] transition-colors">
            {address}
          </span>
        </a>
      </div>
    </main>
  );
}