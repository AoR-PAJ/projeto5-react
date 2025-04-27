import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Registo from "./pages/Registo/Registo";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Profile from "./pages/Profile/Profile";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ErrorPage from "./pages/Error/ErrorPage";
import CreateProduct from "./pages/CreateProduct/CreateProduct";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import ForgotPassWord from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import useSessionTimeout from "./hooks/useSessionTimeout";
import Dashboard from "./pages/Dashboard/Dashboard";
import UsersList from "./pages/UsersList/UsersList";
import Chat from "./pages/Chat/Chat";

import { useAuthStore } from "./stores/useAuthStore";
import { IntlProvider } from "react-intl";

import ptMessages from "./translations/pt.json";
import enMessages from "./translations/en.json";
import AllProducts from "./pages/AllProducts/AllProducts";

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import AccessDenied from "./pages/AccessDenied/AccessDenied";

//constantes paara controlar a lingaugem do site
const messages = {
  pt: ptMessages,
  en: enMessages,
};

const App = () => {
  const location = useLocation();

  // Define as rotas onde o Header não deve aparecer
  const hideHeaderRoutes = ["/forgot-password", "/reset-password"];

  //hook para monitorizar o tempo de sessão
  useSessionTimeout();

  return (
    <>
      {/* Renderiza o Header apenas se a rota atual não estiver em hideHeaderRoutes */}
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
        <Route path="/homePage" element={<HomePage />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/users/:username" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassWord />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/products" element={<AllProducts />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/*" element={<ErrorPage />} />

        {/* Rota protegida para o dashboard (apenas para administradores) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Página de acesso negado */}
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
      <Footer />
    </>
  );
};

const Root = () => {
  const language = useAuthStore((state) => state.language);

  return (
    <IntlProvider locale={language} messages={messages[language]}>
      <Router>
        <App />
      </Router>
    </IntlProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

reportWebVitals();
