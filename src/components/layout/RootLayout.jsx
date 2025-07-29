// src/components/layout/RootLayout.jsx

import { Outlet } from 'react-router-dom';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'sonner';
import { ScrollToTop } from '@/utils/ScrollToTop';

// Componentes que precisam de dados do contexto
import { ProductModal } from '@/components/ProductModal';
import { CartSidebar } from '@/components/CartSidebar';
import { FilterSidebar } from '@/components/FilterSidebar';
import { CouponModal } from '@/components/CouponModal';
import { NotifyModal } from '@/components/NotifyModal';

// O Layout agora é um componente puro que recebe os dados via props
function Layout() {
  const {
    // A maioria dos valores agora são usados ou pelo Header diretamente, ou pelos modais
    setIsCartOpen,
    selectedProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    addToCart,
    favorites,
    toggleFavorite,
    isCartOpen,
    isFilterOpen,
    setIsFilterOpen,
    isCouponModalOpen,
    setIsCouponModalOpen,
    notifyModalOpen,
    productToNotify,
    setNotifyModalOpen,
  } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <Toaster richColors position="top-right" />

      {/* O Header agora só precisa da função para abrir o carrinho. O resto ele pega do contexto. */}
      <Header
        onCartClick={() => setIsCartOpen(true)}
      />

      <Outlet />
      
      <Footer />

      {/* Os modais e sidebars continuam aqui, usando o contexto diretamente */}
      <NotifyModal
        product={productToNotify}
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
      />
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={addToCart}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
      />
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      <CouponModal 
        isOpen={isCouponModalOpen} 
        onClose={() => setIsCouponModalOpen(false)} 
      />
    </div>
  );
}


// O RootLayout agora apenas envolve o Layout com o AppProvider
export function RootLayout() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}