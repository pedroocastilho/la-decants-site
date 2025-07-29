import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; // ou App.css, o que você usar para estilos globais
import './App.css';
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
import { SuccessPage } from './pages/SuccessPage';
import { FailurePage } from './pages/FailurePage';
import { PendingPage } from './pages/PendingPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { UpdatePasswordPage } from './pages/UpdatePasswordPage';

// Importa nosso layout e nossas páginas
import { RootLayout } from './components/layout/RootLayout';
import { HomePage } from './pages/HomePage';
import { MasculinosPage } from './pages/MasculinosPage';
import { FemininosPage } from './pages/FemininosPage';
import { ContatoPage } from './pages/ContatoPage';
import { FavoritosPage } from './pages/FavoritosPage';
import { CheckoutPage } from './pages/CheckoutPage';

// Cria o roteador com a definição das nossas rotas
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // O layout principal que contém o Header e Footer
    children: [
      // As páginas (children) que serão renderizadas dentro do RootLayout
      {
        index: true, // Isso marca a HomePage como a página padrão para o caminho "/"
        element: <HomePage />,
      },
      {
        path: 'masculinos',
        element: <MasculinosPage />,
      },
      {
        path: 'femininos',
        element: <FemininosPage />,
      },
      {
        path: 'contato',
        element: <ContatoPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'produto/:slug', // A rota dinâmica
        element: <ProductDetailPage />,
      },
      {
        path: 'favoritos',
        element: <FavoritosPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      { path: 'success',
         element: <SuccessPage /> 
        },
      { path: 'failure',
         element: <FailurePage /> 
        },
      { path: 'pending',
         element: <PendingPage /> 
        },
      {
        path: 'arabes',
        element: <ArabesPage />,
      },
      {
        path: 'victorias-secret',
        element: <VictoriasSecretPage />,
      },
      {
        element: <ProtectedRoute />, // Este componente protege todas as rotas filhas
        children: [
          {
            path: 'perfil',
            element: <ProfilePage />,
            children: [ // Sub-rotas para cada secção do perfil
              {
                path: 'dados',
                element: <PersonalDataPage />,
              },
              {
                path: 'enderecos',
                element: <AddressesPage />,
              },
              {
                path: 'pedidos',
                element: <OrdersPage />,
              },
              { path: 'forgot-password', element: <ForgotPasswordPage /> },
              { path: 'update-password', element: <UpdatePasswordPage /> },
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