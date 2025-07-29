import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';

export function AddressesPage() {
  const { session } = useAppContext();
  const [addresses, setAddresses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const [newAddress, setNewAddress] = React.useState({
    fullName: '', cep: '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: ''
  });

  React.useEffect(() => {
    const fetchAddresses = async () => {
      if (!session) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false }); // Ordena pelos mais recentes

      if (error) {
        toast.error("Não foi possível carregar os seus endereços.");
        console.error("Erro ao buscar endereços:", error);
      } else {
        setAddresses(data);
      }
      setLoading(false);
    };
    fetchAddresses();
  }, [session]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewAddress(prev => ({ ...prev, [id]: value }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    // Prepara os dados para inserção, garantindo que os nomes correspondem às colunas
    const addressData = {
      user_id: session.user.id,
      full_name: newAddress.fullName,
      cep: newAddress.cep,
      street: newAddress.street,
      number: newAddress.number,
      complement: newAddress.complement,
      neighborhood: newAddress.neighborhood,
      city: newAddress.city,
      state: newAddress.state,
    };

    const { error } = await supabase.from('addresses').insert(addressData);

    if (error) {
      toast.error("Não foi possível guardar o novo endereço.");
      console.error("Erro ao inserir endereço:", error); // O erro detalhado aparecerá no console (F12)
    } else {
      toast.success("Endereço adicionado com sucesso!");
      const { data } = await supabase.from('addresses').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
      setAddresses(data);
      setNewAddress({ fullName: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
    }
  };
  
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Tem a certeza de que quer remover este endereço?")) return;
    
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId);

    if (error) {
      toast.error("Não foi possível remover o endereço.");
      console.error("Erro ao apagar endereço:", error);
    } else {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast.success("Endereço removido com sucesso.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus Endereços</h1>
        <p className="text-gray-500">Adicione e gira os seus endereços de entrega.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PlusCircle className="w-5 h-5" />
            Adicionar Novo Endereço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="fullName">Nome do Destinatário</Label>
              <Input id="fullName" value={newAddress.fullName} onChange={handleInputChange} required />
            </div>
            <Input id="cep" value={newAddress.cep} onChange={handleInputChange} placeholder="CEP" required />
            <Input id="street" value={newAddress.street} onChange={handleInputChange} placeholder="Rua" required />
            <Input id="number" value={newAddress.number} onChange={handleInputChange} placeholder="Número" required />
            <Input id="complement" value={newAddress.complement} onChange={handleInputChange} placeholder="Complemento (opcional)" />
            <Input id="neighborhood" value={newAddress.neighborhood} onChange={handleInputChange} placeholder="Bairro" required />
            <Input id="city" value={newAddress.city} onChange={handleInputChange} placeholder="Cidade" required />
            <Input id="state" value={newAddress.state} onChange={handleInputChange} placeholder="Estado" required />
            <Button type="submit" className="md:col-span-2 bg-[#AB7D47] hover:bg-[#B8860B]">Guardar Endereço</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading ? <p>A carregar endereços...</p> : (
          addresses.map(addr => (
            <div key={addr.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">{addr.full_name}</p>
                <p className="text-sm text-gray-600">{addr.street}, {addr.number}</p>
                <p className="text-sm text-gray-600">{addr.neighborhood} - {addr.city}, {addr.state}</p>
                <p className="text-sm text-gray-600">{addr.cep}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))
        )}
        {!loading && addresses.length === 0 && <p>Você ainda não tem nenhum endereço guardado.</p>}
      </div>
    </div>
  );
}