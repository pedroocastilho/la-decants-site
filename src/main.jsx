import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; 
import './App.css';

// Importações das páginas (o seu código está correto)
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ArabesPage } from './pages/ArabesPage';
import { VictoriasSecretPage } from './pages/VictoriasSecretPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { PersonalDataPage } from './pages/profile/PersonalDataPage';
import { AddressesPage } from './pages/profile/AddressesPage';
import { OrdersPage } from './pages/profile/OrdersPage';
import { RootLayout } from './components/layout/RootLayout';
import { HomePage } from './pages/HomePage';
import { MasculinosPage } from './pages/MasculinosPage';
import { FemininosPage } from './pages/FemininosPage';
import { ContatoPage } from './pages/ContatoPage';
import { FavoritosPage } from './pages/FavoritosPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';
import { SuccessPage } from './pages/SuccessPage';
import { FailurePage } from './pages/FailurePage';
import { PendingPage } from './pages/PendingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      // --- ROTAS PÚBLICAS ---
      { index: true, element: <HomePage /> },
      { path: 'masculinos', element: <MasculinosPage /> },
      { path: 'femininos', element: <FemininosPage /> },
      { path: 'contato', element: <ContatoPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'produto/:slug', element: <ProductDetailPage /> },
      { path: 'favoritos', element: <FavoritosPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'success', element: <SuccessPage /> },
      { path: 'failure', element: <FailurePage /> },
      { path: 'pending', element: <PendingPage /> },
      { path: 'arabes', element: <ArabesPage /> },
      { path: 'victorias-secret', element: <VictoriasSecretPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'update-password', element: <UpdatePasswordPage /> },

      // --- ROTAS PROTEGIDAS ---
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'perfil',
            element: <ProfilePage />,
            children: [
              { path: 'dados', element: <PersonalDataPage /> },
              { path: 'enderecos', element: <AddressesPage /> },
              { path: 'pedidos', element: <OrdersPage /> },
            ]
          }
        ]
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);