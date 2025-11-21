import { Navigate, Outlet } from "react-router-dom";

const RotasPrivadas = () => {
    const token = localStorage.getItem("@pesa_box_token");
    return token ? <Outlet /> : <Navigate to="/login" />
}
export default RotasPrivadas;