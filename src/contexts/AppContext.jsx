import React from 'react';
import { createContext, useState, useMemo, useContext, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { allProducts } from '@/constants/products';
import { supabase } from '@/lib/supabaseClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  // --- Estados Principais ---
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // --- Estados da Interface e Modais (sem alterações) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    brands: [], categories: [], subCategories: [], sizes: [], priceRange: [0, 200],
  });
  const [productsForFilter, setProductsForFilter] = useState(allProducts);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [productToNotify, setProductToNotify] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- EFEITO 1: GERE APENAS A SESSÃO ---
  useEffect(() => {
    // Busca a sessão inicial uma vez
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); // Para o loading inicial
    });

    // "Escuta" por mudanças (login, logout) e apenas atualiza a sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- EFEITO 2: REAGE ÀS MUDANÇAS DE SESSÃO PARA BUSCAR OU LIMPAR DADOS ---
  useEffect(() => {
    // Se não houver sessão (utilizador fez logout ou não está autenticado), limpa os dados
    if (!session) {
      setProfile(null);
      setCartItems([]);
      setFavorites(new Set());
      return;
    }

    // Se houver uma sessão, busca os dados do perfil
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, cart_items, favorite_items')
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      } else if (data) {
        setProfile(data);
        setCartItems(data.cart_items || []);
        setFavorites(new Set(data.favorite_items || []));
      }
    };
    
    fetchUserData();
  }, [session]); // Este efeito é executado sempre que a 'session' muda

  // --- EFEITO 3: SINCRONIZAÇÃO COM DEBOUNCE (sem alterações) ---
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (session?.user && !loading) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      
      debounceTimeout.current = setTimeout(async () => {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            cart_items: cartItems, 
            favorite_items: Array.from(favorites) 
          })
          .eq('id', session.user.id);

        if (error) {
          toast.error("Não foi possível guardar as suas alterações.");
          console.error("Erro ao sincronizar:", error);
        }
      }, 1500);
    }
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [cartItems, favorites, session, loading]);

  // --- Funções de Carrinho e Favoritos (agora só alteram o estado local) ---
  const addToCart = (product, quantity = 1) => {
    const newCart = [...cartItems];
    const itemIndex = newCart.findIndex(item => item.id === product.id);
    if (itemIndex > -1) {
      newCart[itemIndex].quantity += quantity;
    } else {
      newCart.push({ ...product, quantity });
    }
    setCartItems(newCart);
    toast.success(`${quantity}x ${product.name} adicionado(s) ao carrinho!`);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    const newCart = cartItems
      .map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
      .filter(item => item.quantity > 0);
    setCartItems(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cartItems.filter(item => item.id !== productId);
    setCartItems(newCart);
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  // Outras Funções
  const openFiltersWithContext = (products) => { setProductsForFilter(products); setIsFilterOpen(true); };
  const handleSearch = (e) => setSearchTerm(e.target.value);
  const openNotifyModal = (product) => { setProductToNotify(product); setNotifyModalOpen(true); };
  const openProductModal = (product) => { setSelectedProduct(product); setIsProductModalOpen(true); };
  
  // Valores Calculados
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const favoritesCount = favorites.size;
  const activeFiltersCount = (filters.brands?.length || 0) + (filters.categories?.length || 0) + (filters.subCategories?.length || 0) + (filters.sizes?.length || 0) + (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0);
  
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = !filters.brands || filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchesCategory = !filters.categories || filters.categories.length === 0 || filters.categories.includes(product.category);
      const matchesSubCategory = !filters.subCategories || filters.subCategories.length === 0 || filters.subCategories.includes(product.subCategory);
      const matchesSize = !filters.sizes || filters.sizes.length === 0 || filters.sizes.includes(product.size);
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      return matchesSearch && matchesBrand && matchesCategory && matchesSubCategory && matchesSize && matchesPrice;
    });
    // Lógica de ordenação
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price); break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:
        break;
    }
    return filtered;
  }, [searchTerm, filters, sortBy, allProducts]);

  // Objeto de valor a ser partilhado com toda a aplicação
  const value = {
    session, profile, setProfile, cartItems, favorites, loading,
    searchTerm, filters, sortBy,
    isCartOpen, isFilterOpen, productsForFilter, isCouponModalOpen,
    isProductModalOpen, selectedProduct,
    notifyModalOpen, productToNotify, cartItemCount, favoritesCount,
    activeFiltersCount, filteredProducts,
    allProducts, // <-- A LINHA QUE FALTAVA FOI ADICIONADA AQUI
    addToCart, updateCartQuantity, removeFromCart, toggleFavorite,
    handleSearch, setFilters, setSortBy,
    openFiltersWithContext, setIsCartOpen, setIsFilterOpen,
    setIsCouponModalOpen, setNotifyModalOpen, openProductModal,
    onFiltersChange: setFilters
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  return useContext(AppContext);
};