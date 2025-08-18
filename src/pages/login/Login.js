import axios from 'axios';
import styles from './Login.module.scss';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { AlertErro } from '../../components/Alertas';
import { Apis } from '../../Apis';
const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    useEffect(() => {
        navigation('/', { replace: true });
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        if (!formValues.email || !formValues.senha) {
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

            const response = await axios.post(`${Apis.urlApicultor}/login`, formValues, requestoptions);
            localStorage.setItem('@pesagem_token', response?.data.registros.token);
            localStorage.setItem('@pesagem_nome', response?.data.registros.nome);
            navigation('/home', { replace: true });
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
                <h1>LOGIN</h1>
                <label>
                    <span>Email:</span>
                    <input type='email' name='email' placeholder='Insira seu email' />
                </label>
                <label>
                    <span>Senha:</span>
                    <input type='password' name='senha' placeholder='Insira sua senha' />
                </label>
                <button>Acessar</button>
                <div className={styles.footer}>
                    <a onClick={() => navigation('/apicultor/create')}>Criar conta</a>
                    <a onClick={() => navigation('/senha/alterar/solicitar')} style={{ textAlign: 'right' }}>Esqueci minha senha</a>
                </div>
            </form>
        </div>
    )
}
export default Login;