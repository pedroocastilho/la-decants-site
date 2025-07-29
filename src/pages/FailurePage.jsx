import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function FailurePage() {
  return (
    <main className="container mx-auto px-4 py-12 text-center flex flex-col items-center">
      <XCircle className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Ocorreu um erro</h1>
      <p className="text-gray-600 mb-6">Não foi possível processar o seu pagamento. Por favor, tente novamente.</p>
      <Link to="/checkout" className="bg-[#AB7D47] text-white px-6 py-2 rounded-md hover:bg-[#B8860B]">
        Tentar Novamente
      </Link>
    </main>
  );
}