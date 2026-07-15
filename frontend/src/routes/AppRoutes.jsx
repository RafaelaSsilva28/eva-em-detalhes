import {
  Navigate,
  Route,
  Routes,
  useLocation
} from "react-router-dom";

import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import RotaProtegida from "../components/RotaProtegida/RotaProtegida.jsx";

import Home from "../pages/Home/Home.jsx";
import Produtos from "../pages/Produtos/Produtos.jsx";
import Personalizados from "../pages/Personalizados/Personalizados.jsx";
import Galeria from "../pages/Galeria/Galeria.jsx";
import Sobre from "../pages/Sobre/Sobre.jsx";
import Contato from "../pages/Contato/Contato.jsx";
import Favoritos from "../pages/Favoritos/Favoritos.jsx";

import Login from "../pages/Login/Login.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import AdminProdutos from "../pages/AdminProdutos/AdminProdutos.jsx";
import AdminProdutoNovo from "../pages/AdminProdutoNovo/AdminProdutoNovo.jsx";
import AdminCategorias from "../pages/AdminCategorias/AdminCategorias.jsx";
import AdminImagens from "../pages/AdminImagens/AdminImagens.jsx";
import AdminPerfil from "../pages/AdminPerfil/AdminPerfil.jsx";
function AppRoutes() {
  const location = useLocation();

  const rotaSemLayoutPublico =
    location.pathname === "/login" ||
    location.pathname.startsWith("/dashboard");

  return (
    <>
      {!rotaSemLayoutPublico && <Navbar />}

      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/personalizados" element={<Personalizados />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/favoritos" element={<Favoritos />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ATALHOS ERRADOS DO ADMIN */}
        <Route
          path="/categorias"
          element={<Navigate to="/dashboard/categorias" replace />}
        />

        <Route
          path="/imagens"
          element={<Navigate to="/dashboard/imagens" replace />}
        />
        <Route path="/dashboard/perfil" element={<AdminPerfil />} />

        {/* ROTAS PROTEGIDAS DO ADMIN */}
        <Route element={<RotaProtegida />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/dashboard/produtos" element={<AdminProdutos />} />
  <Route path="/dashboard/produtos/novo" element={<AdminProdutoNovo />} />
  <Route path="/dashboard/categorias" element={<AdminCategorias />} />
  <Route path="/dashboard/imagens" element={<AdminImagens />} />
  <Route path="/dashboard/perfil" element={<AdminPerfil />} />
</Route>

        {/* QUALQUER ROTA ERRADA VOLTA PARA HOME */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!rotaSemLayoutPublico && <Footer />}
    </>
  );
}

export default AppRoutes;