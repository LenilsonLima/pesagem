import axios from 'axios';
import styles from './AlterarApicultor.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { AlertConfirm, AlertErro, AlertSucess } from '../../../components/Alertas';
import { Apis } from '../../../Apis';
const AlterarApicultor = () => {
    const [loading, setLoading] = useState(true);
    const [apicultor, setApicultor] = useState(false);
    const navigation = useNavigate();


    useEffect(() => {
        handleApicultor();
    }, []);

    const handleApicultor = async () => {
        try {
            setLoading(true);
            const requestoptions = {
                headers: {
                    'Content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                }
            }

            const response = await axios.get(Apis.urlApicultor, requestoptions);
            setApicultor(response.data.registros[0]);

        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        if (!formValues.nome || !formValues.email) {
            AlertErro('Todos os campos devem ser preenchidos!');
            return
        }

        try {
            setLoading(true);
            const requestoptions = {
                headers: {
                    'Content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                }
            }

            const response = await axios.put(Apis.urlApicultor, formValues, requestoptions);
            AlertSucess(response?.data.retorno.mensagem);
            localStorage.setItem('@pesagem_nome', formValues?.nome);
            navigation(-1);
        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
            setLoading(false);
        }

    }

    const handleRemoverApicultorConfirm = async () => {
        AlertConfirm("Ao clicar em confirmar, você concorda em remover o apicultor e todos os dados vinculados a ele da nossa base de dados, essa ação não poderá ser revertida.", handleRemoverApicultor)
    }

    const handleRemoverApicultor = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                }
            }

            const response = await axios.delete(Apis.urlApicultor, requestOptions);
            AlertSucess(response.data.retorno.mensagem);
            localStorage.clear();
            navigation('/login');
        } catch (error) {
            AlertSucess(error.response.data.retorno.mensagem);
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className={styles.container_alterar_apicultor}>
            <form onSubmit={handleSubmit}>
                <h1>ATUALIZAR APICULTOR</h1>
                <label>
                    <span>Nome:</span>
                    <input type='text' name='nome' placeholder='Insira seu nome' defaultValue={apicultor.nome} />
                </label>
                <label>
                    <span>E-mail:</span>
                    <input type='email' name='email' placeholder='Insira seu e-mail' defaultValue={apicultor.email} />
                </label>
                <button>Atualizar</button>
                <div className={styles.footer}>
                    <a onClick={() => navigation(-1)}>Retornar à página anterior</a>
                    <a style={{ textAlign: 'right' }} onClick={handleRemoverApicultorConfirm}>Apagar minha conta</a>
                </div>
            </form>
        </div>
    )
}
export default AlterarApicultor;