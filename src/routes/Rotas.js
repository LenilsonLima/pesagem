import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "../pages/login/Login";
import CadastrarApicultor from "../pages/cadastros/apicultor/CadastrarApicultor";
import ListarCaixas from "../pages/listagem/caixa/ListarCaixas";
import CadastrarCaixa from "../pages/cadastros/caixa/CadastrarCaixa";
import AlterarApicultor from "../pages/alterar/apicultor/AlterarApicultor";
import AlterarCaixa from "../pages/alterar/caixa/AlterarCaixa";
import RelatorioCaixas from "../pages/listagem/relatorios/RelatorioCaixas";
import AlterarSenha from "../pages/alterar/senha/AlterarSenha";
import SolicitarEmailSenha from "../pages/alterar/solicitarEmailSenha/SolicitarEmailSenha";

// Componente para rotas privadas
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('@pesagem_token');
    const navigation = useNavigate();
    if (!token) {
        navigation('/login');
        return <Login />; // Redireciona para Login se não houver token
    }
    return children; // Caso haja token, renderiza o conteúdo da rota
};

const Rotas = () => {
    return (
        <Routes>
            <Route path="*" element={
                <Login />
            } />
            <Route path="/senha/alterar/:token_senha" element={
                <AlterarSenha />
            } />
            <Route path="/senha/alterar/solicitar" element={
                <SolicitarEmailSenha />
            } />
            <Route path="/apicultor/create" element={
                <CadastrarApicultor />
            } />
            <Route path="/home" element={
                <PrivateRoute>
                    <ListarCaixas />
                </PrivateRoute>
            } />
            <Route path="/caixa/relatorio/:caixa_id" element={
                <PrivateRoute>
                    <RelatorioCaixas />
                </PrivateRoute>
            } />
            <Route path="/apicultor/alterar" element={
                <PrivateRoute>
                    <AlterarApicultor />
                </PrivateRoute>
            } />
            <Route path="/caixa/create" element={
                <PrivateRoute>
                    <CadastrarCaixa />
                </PrivateRoute>
            } />
            <Route path="/caixa/alterar/:caixa_id" element={
                <PrivateRoute>
                    <AlterarCaixa />
                </PrivateRoute>
            } />
        </Routes>
    );
}

export default Rotas;
