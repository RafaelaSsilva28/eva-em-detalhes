import { Navigate, Outlet } from "react-router-dom";

function RotaProtegida() {
  const token = localStorage.getItem("tokenEvaEmDetalhes");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RotaProtegida;