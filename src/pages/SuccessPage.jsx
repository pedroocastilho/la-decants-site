import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function SuccessPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-center flex flex-col items-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Obrigado pela sua compra!</h1>
      <p className="text-gray-600 mb-6">O seu pagamento foi aprovado e o seu pedido está a ser preparado.</p>
      <div className="flex gap-4">
        <Link to="/perfil/pedidos" className="bg-[#AB7D47] text-white px-6 py-2 rounded-md hover:bg-[#B8860B]">
          Ver Meus Pedidos
        </Link>
        <Link to="/" className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100">
          Continuar a Comprar
        </Link>
      </div>
    </main>
  );
}