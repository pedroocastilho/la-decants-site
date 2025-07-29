import React from 'react';
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

// Importações do Mercado Pago
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Pega a chave pública do seu ficheiro .env.local
const mpPublicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

export function CheckoutPage() {
  const { cartItems, session } = useAppContext();

  // --- Estados ---
  const [savedAddresses, setSavedAddresses] = React.useState([]);
  const [address, setAddress] = React.useState({
    fullName: '', cep: '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '',
  });
  const [shippingOptions, setShippingOptions] = React.useState([]);
  const [selectedShipping, setSelectedShipping] = React.useState(null);
  const [isLoadingShipping, setIsLoadingShipping] = React.useState(false);
  
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);
  const [discount, setDiscount] = React.useState(0);
  const [isLoadingCoupon, setIsLoadingCoupon] = React.useState(false);

  const [isLoadingPayment, setIsLoadingPayment] = React.useState(false);
  const [preferenceId, setPreferenceId] = React.useState(null);

  // --- Cálculos de Preço ---
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freteGratisThreshold = 299.00;
  const hasFreeShipping = subtotal >= freteGratisThreshold;
  const shippingCost = selectedShipping ? (hasFreeShipping ? 0 : Number(selectedShipping.price)) : 0;
  const total = subtotal + shippingCost - discount;

  // --- Efeitos (useEffect) ---
  React.useEffect(() => {
  // Limpa o cupom se o subtotal do carrinho mudar
  setAppliedCoupon(null);
  setDiscount(0);
  setCouponCode('');
}, [subtotal]);

  React.useEffect(() => {
    if (mpPublicKey) {
      initMercadoPago(mpPublicKey, { locale: 'pt-BR' });
    }
  }, []);

  React.useEffect(() => {
    const fetchAddresses = async () => {
      if (session?.user) {
        const { data } = await supabase.from('addresses').select('*').eq('user_id', session.user.id);
        if (data) setSavedAddresses(data);
      }
    };
    fetchAddresses();
  }, [session]);
  
  // --- Funções Handler ---
  const handleSelectSavedAddress = (savedAddr) => {
    setAddress({
      fullName: savedAddr.full_name || '',
      cep: savedAddr.cep || '',
      street: savedAddr.street || '',
      number: savedAddr.number || '',
      complement: savedAddr.complement || '',
      neighborhood: savedAddr.neighborhood || '',
      city: savedAddr.city || '',
      state: savedAddr.state || '',
    });
    setShippingOptions([]);
    setSelectedShipping(null);
  };

  const handleAddressChange = (e) => {
    const { id, value } = e.target;
    setAddress(prev => ({ ...prev, [id]: value }));
  };

  const handleCalculateShipping = async () => {
    if (address.cep.length !== 8) {
      toast.error('Por favor, insira um CEP válido com 8 dígitos.');
      return;
    }
    
    setIsLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);

    try {
      const cepResponse = await fetch(`https://viacep.com.br/ws/${address.cep}/json/`);
      if (!cepResponse.ok) throw new Error('CEP não encontrado.');
      const cepData = await cepResponse.json();
      if (cepData.erro) throw new Error('CEP não encontrado.');

      setAddress(prev => ({
        ...prev,
        street: cepData.logradouro || '',
        neighborhood: cepData.bairro || '',
        city: cepData.localidade || '',
        state: cepData.uf || '',
      }));

      const { data, error } = await supabase.functions.invoke('calculate-shipping', {
        body: { cepDestino: address.cep },
      });

      if (error) throw error;
      
      const validOptions = data.filter(option => !option.error);
      setShippingOptions(validOptions);

      if (validOptions.length > 0) {
        setSelectedShipping(validOptions[0]);
      } else {
        toast.error('Nenhuma opção de entrega encontrada para este CEP.');
      }

    } catch (error) {
      toast.error(error.message || 'Não foi possível buscar o CEP ou calcular o frete.');
      console.error('Erro:', error);
    } finally {
      setIsLoadingShipping(false);
    }
  };
  
  // A função para aplicar o cupom, agora no sítio certo
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    if (!session?.user) {
      toast.error("Você precisa de estar autenticado para aplicar um cupom.");
      return;
    }
    setIsLoadingCoupon(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-coupon', {
        body: { couponCode: couponCode, userId: session.user.id },
      });

      if (error) {
        // O Supabase pode devolver o erro dentro de um objeto 'data'
        throw new Error(data?.error || "Erro ao validar cupom.");
      }

      toast.success(`Cupom "${data.code}" aplicado com sucesso!`);
      setAppliedCoupon(data);
      
      if (data.discount_type === 'percentage') {
        const discountValue = (subtotal * data.discount_value) / 100;
        setDiscount(discountValue);
      }

    } catch (err) {
      toast.error(err.message);
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setIsLoadingCoupon(false);
    }
  };

  const handleCreatePayment = async () => {
    if (!selectedShipping) {
      toast.error("Por favor, calcule e selecione um método de envio primeiro.");
      return;
    }
    
    if (!session?.user?.id) {
      toast.error("Por favor, faça login para continuar a compra.");
      return;
    }

    setIsLoadingPayment(true);

    try {
      const finalShippingInfo = { ...selectedShipping, price: shippingCost };
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          cartItems: cartItems,
          shippingInfo: finalShippingInfo,
          userId: session.user.id,
          address: address,
          // --- ADICIONAMOS A INFORMAÇÃO DO CUPOM AQUI ---
          appliedCoupon: appliedCoupon,
          discountAmount: discount
        },
      });

      if (error) throw error;
      
      setPreferenceId(data.preferenceId);

    } catch (error) {
      toast.error("Não foi possível iniciar o pagamento. Tente novamente.");
      console.error('Erro ao criar pagamento:', error);
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        
        {/* Coluna da Esquerda: Formulários */}
        <div className="order-2 lg:order-1">
          <div className="space-y-8">
            {/* Secção de Contacto */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
              <Input 
                type="email" 
                placeholder="Seu endereço de e-mail" 
                defaultValue={session?.user?.email}
                disabled={!!session}
              />
            </div>

            {/* Secção de Endereço de Entrega */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Endereço de Entrega</h2>
              {session && savedAddresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-sm font-medium">Selecione um endereço guardado:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map(addr => (
                      <button 
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className="border rounded-lg p-3 text-left text-sm hover:border-gray-500 hover:bg-gray-200"
                      >
                        <p className="font-semibold">{addr.full_name}</p>
                        <p>{addr.street}, {addr.number}</p>
                        <p>{addr.city}, {addr.state} - {addr.cep}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-gray-500 pt-2">ou preencha um novo endereço abaixo.</p>
                </div>
              )}
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <Input id="fullName" value={address.fullName} onChange={handleAddressChange} type="text" placeholder="Nome completo" required />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input id="cep" value={address.cep} onChange={(e) => setAddress(prev => ({ ...prev, cep: e.target.value.replace(/\D/g, '') }))} type="text" placeholder="CEP" required maxLength={8} />
                  </div>
                  <Button variant="outline" className="h-10" onClick={handleCalculateShipping} disabled={isLoadingShipping}>
                    {isLoadingShipping ? 'Buscando...' : 'Buscar CEP'}
                  </Button>
                </div>
                <Input id="street" value={address.street} onChange={handleAddressChange} type="text" placeholder="Endereço (Rua, Av.)" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="number" value={address.number} onChange={handleAddressChange} type="text" placeholder="Número" required />
                  <Input id="complement" value={address.complement} onChange={handleAddressChange} type="text" placeholder="Complemento (opcional)" />
                </div>
                <Input id="neighborhood" value={address.neighborhood} onChange={handleAddressChange} type="text" placeholder="Bairro" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="city" value={address.city} onChange={handleAddressChange} type="text" placeholder="Cidade" required />
                  <Input id="state" value={address.state} onChange={handleAddressChange} type="text" placeholder="Estado" required />
                </div>
              </form>
            </div>
            
            {/* Secção de Envio */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Método de Envio</h2>
              <div className="border rounded-lg p-4 space-y-3 min-h-[80px]">
                {isLoadingShipping && <p className="text-gray-500">Calculando opções de frete...</p>}
                {!isLoadingShipping && shippingOptions.length === 0 && (
                  <p className="text-gray-500">Insira o seu CEP para ver as opções de entrega.</p>
                )}
                {shippingOptions.map(option => (
                  <div 
                    key={option.id} 
                    className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-colors ${selectedShipping?.id === option.id ? 'bg-gray-200 border border-black' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedShipping(option)}
                  >
                    <div>
                      <p className="font-semibold">{option.company.name} - {option.name}</p>
                      <p className="text-sm text-gray-600">Prazo: {option.delivery_time} dias</p>
                    </div>
                    <p className="font-semibold">{hasFreeShipping ? 'Grátis' : `R$ ${Number(option.price).toFixed(2)}`}</p>
                  </div>
                ))}
              </div>
            </div>

            {!isLoadingShipping && shippingOptions.length > 0 && (
                  <div 
                    key="retirada" 
                    className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-colors ${selectedShipping?.id === 'retirada' ? 'bg-amber-100 border border-amber-300' : 'hover:bg-gray-100'}`}
                    onClick={() => setSelectedShipping({ id: 'retirada', name: 'Retirar no local (após confirmação)', company: { name: 'Ponto Físico' }, price: '0.00' })}
                  >
                    <div>
                      <p className="font-semibold">Retirar no local</p>
                      <p className="text-sm text-gray-600">São Mateus do Sul - PR</p>
                    </div>
                    <p className="font-semibold">Grátis</p>
                  </div>
                )}

            {/* Secção de Pagamento */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Pagamento</h2>
              <div className="border rounded-lg p-6 text-center">
                {preferenceId ? (
                  <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
                ) : (
                  <Button 
                    className="w-full bg-[#AB7D47] hover:bg-[#B8860B] h-12 text-lg"
                    onClick={handleCreatePayment}
                    disabled={isLoadingPayment || cartItems.length === 0 || !selectedShipping}
                  >
                    {isLoadingPayment ? 'Gerando pagamento...' : 'Finalizar e Pagar'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Resumo do Pedido */}
        <div className="order-1 lg:order-2 bg-gray-50 rounded-lg p-6 h-fit sticky top-28">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumo do Pedido</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative flex-shrink-0"> 
                  <div className="w-16 h-16 rounded-md border bg-white overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <Badge className="absolute -top-2 -right-2 bg-[#AB7D47] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {item.quantity}
                  </Badge>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">R${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <Separator className="my-6" />

          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="Código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={!!appliedCoupon}
            />
            <Button 
              variant="outline" 
              onClick={handleApplyCoupon} 
              disabled={isLoadingCoupon || !!appliedCoupon}
              className="bg-white"
            >
              {isLoadingCoupon ? 'A aplicar...' : 'Aplicar'}
            </Button>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p className="font-medium text-gray-800">R${subtotal.toFixed(2)}</p>
            </div>
            
            {appliedCoupon && (
              <div className="flex justify-between text-green-600">
                <p>Desconto ({appliedCoupon.code})</p>
                <p className="font-medium">- R${discount.toFixed(2)}</p>
              </div>
            )}

            <div className="flex justify-between">
              <p>Frete</p>
              <p className="font-medium text-gray-800">
                {selectedShipping 
                  ? (hasFreeShipping ? 'Grátis' : `R$ ${shippingCost.toFixed(2)}`) 
                  : 'A calcular'
                }
              </p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-bold text-lg">
            <p className="text-gray-900">Total</p>
            <p className="text-[#AB7D47] text-2xl">R${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}