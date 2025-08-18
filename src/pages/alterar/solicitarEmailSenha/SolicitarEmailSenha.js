import axios from 'axios';
import styles from './SolicitarEmailSenha.module.scss';
import { useState } from 'react';
import Loading from '../../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { AlertErro, AlertSucess } from '../../../components/Alertas';
import { Apis } from '../../../Apis';
const SolicitarEmailSenha = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        if (!formValues.email) {
            AlertErro('Preencha todos os campos e tente novamente!');
            return
        }

        try {
            setLoading(true);
            const requestoptions = {
                headers: {
                    'Content-type': 'application/json'
                }
            }

            const response = await axios.post(`${Apis.urlApicultor}/senha`, formValues, requestoptions);
            AlertSucess(response?.data.retorno.mensagem);
            navigation('/', { replace: true });
        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
            setLoading(false);
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className={styles.container_solicitar_alterar}>
            <form onSubmit={handleSubmit}>
                <h1>SOLITAR TROCA DE SENHA</h1>
                <label>
                    <span>E-mail:</span>
                    <input type='email' name='email' placeholder='Insira seu e-mail' />
                </label>
                <button>Solicitar</button>
                <div className={styles.footer}>
                    <a onClick={() => navigation(-1)}>Acessar minha conta</a>
                </div>
            </form>
        </div>
    )
}
export default SolicitarEmailSenha;