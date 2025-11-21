import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RotasPrivadas from "./RotasPivadas";
import Home from "../pages/home/Home";
import RotasPublicas from "./RotasPublicas";
import Login from "../pages/login/Login";
import CadastrarApicultor from "../pages/cadastro/apicultor/CadastrarApicultor";
import SolicitarTrocarSenha from "../pages/solicitar_trocar_senha/SolicitarTrocarSenha";
import AlterarCaixa from "../pages/alterar/caixa/AlterarCaixa";
import AlterarApicultor from "../pages/alterar/apicultor/AlterarApicultor";
import GraficoPesos from "../pages/grafico_pesos/GraficoPesos";
import RelatorioPesosPdf from "../pages/relatorio_pesos_pdf/RelatorioPesosPdf";
import AnaliseIA from "../pages/analise_ia/AnaliseIA";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RotasPrivadas />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "/caixa/alterar",
                element: <AlterarCaixa />
            },
            {
                path: "/apicultor/alterar",
                element: <AlterarApicultor />
            },
            {
                path: "/pesos/grafico/:caixa_id/:observacao",
                element: <GraficoPesos />
            },
            {
                path: "/pesos/pdf/:caixa_id/:data_inicial/:data_final",
                element: <RelatorioPesosPdf />
            },
            {
                path: "/pesos/analise-ia/:caixa_id/:data_inicial/:data_final/:observacao",
                element: <AnaliseIA />
            }
        ]
    },
    {
        path: "/login",
        element: <RotasPublicas />,
        children: [
            {
                path: "",
                element: <Login />
            },
            {
                path: "apicultor/cadastrar",
                element: <CadastrarApicultor />
            },
            {
                path: "solicitar/troca/senha",
                element: <SolicitarTrocarSenha />
            }
        ]
    }
])

const Rotas = () => {
    return (
        <RouterProvider router={router} />
    )
}
export default Rotas;