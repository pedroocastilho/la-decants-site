import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function PendingPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-center flex flex-col items-center">
      <AlertCircle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Pagamento Pendente</h1>
      <p className="text-gray-600 mb-6">Estamos a aguardar a confirmação do seu pagamento. Assim que for aprovado, o seu pedido será preparado.</p>
      <Link to="/perfil/pedidos" className="bg-[#AB7D47] text-white px-6 py-2 rounded-md hover:bg-[#B8860B]">
        Acompanhar Pedido
      </Link>
    </main>
  );
}