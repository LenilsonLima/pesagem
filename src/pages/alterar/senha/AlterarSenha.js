import axios from 'axios';
import styles from './AlterarSenha.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertErro, AlertSucess } from '../../../components/Alertas';
import Loading from '../../../components/Loading';
import { Apis } from '../../../Apis';
const AlterarSenha = () => {
    const [loading, setLoading] = useState(true);
    const navigation = useNavigate();
    const params = useParams();

    useEffect(() => {
        handleVerificaTokenSenha();
    }, []);

    const handleVerificaTokenSenha = async () => {
        try {
            setLoading(true);
            await axios.get(`${Apis.urlApicultor}/senha/${params?.token_senha}`);
        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
            localStorage.clear();
            navigation('/', { replace: true });
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('token_senha', params.token_senha);
        const formValues = Object.fromEntries(formData);

        if (formValues.senha != formValues.confirmar_senha || formValues.senha.length < 4) {
            AlertErro('As senhas devem ser iguais e conter o minimo de 4 caracteres, tente novamente!');
            return
        }

        try {
            setLoading(true);
            const requestoptions = {
                headers: {
                    'Content-type': 'application/json'
                }
            }

            const response = await axios.put(`${Apis.urlApicultor}/senha/alterar`, formValues, requestoptions);
            navigation('/', { replace: true });
            AlertSucess(response?.data.retorno.mensagem);
        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
            setLoading(false);
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className={styles.container_login}>
            <form onSubmit={handleSubmit}>
                <h1>ATUALIZAR SENHA</h1>
                <label>
                    <span>Senha:</span>
                    <input type='password' name='senha' placeholder='Insira sua senha' />
                </label>
                <label>
                    <span>Confirmar Senha:</span>
                    <input type='password' name='confirmar_senha' placeholder='Confirmar sua senha' />
                </label>
                <button>Atualizar</button>
                <div className={styles.footer}>
                    <a onClick={() => navigation('/', { replace: true })}>Acessar minha conta</a>
                </div>
            </form>
        </div>
    )
}
export default AlterarSenha;