import axios from 'axios';
import styles from './CadastrarApicultor.module.scss';
import { useState } from 'react';
import Loading from '../../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { AlertErro, AlertSucess } from '../../../components/Alertas';
import { Apis } from '../../../Apis';

const CadastrarApicultor = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        if (formValues.senha != formValues.confirmar_senha || formValues.senha.length < 4) {
            AlertErro('As senhas devem ser iguais e conter o minimo de 4 caracteres, tente novamente!');
            return
        }

        if (!formValues.nome || !formValues.email || !formValues.senha) {
            AlertErro('Todos os campos devem ser preenchidos!');
            return
        }

        try {
            setLoading(true);
            const requestoptions = {
                headers: {
                    'Content-type': 'application/json'
                }
            }

            const response = await axios.post(Apis.urlApicultor, formValues, requestoptions);
            console.log(response.data.retorno);
            AlertSucess(response?.data.retorno.mensagem);
            navigation(-1);

        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
            setLoading(false);
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className={styles.container_apicultor}>
            <form onSubmit={handleSubmit}>
                <h1>CRIAR APICULTOR</h1>
                <label>
                    <span>Nome:</span>
                    <input type='text' name='nome' placeholder='Insira seu nome' />
                </label>
                <label>
                    <span>E-mail:</span>
                    <input type='email' name='email' placeholder='Insira seu e-mail' />
                </label>
                <label>
                    <span>Senha:</span>
                    <input type='password' name='senha' placeholder='Insira sua senha' />
                </label>

                <label>
                    <span>Confirmar Senha:</span>
                    <input type='password' name='confirmar_senha' placeholder='Confirme sua senha' />
                </label>
                <button>Cadastrar</button>
                <div className={styles.footer}>
                    <a onClick={() => navigation(-1)}>Acessar minha conta</a>
                </div>
            </form>
        </div>
    )
}
export default CadastrarApicultor;