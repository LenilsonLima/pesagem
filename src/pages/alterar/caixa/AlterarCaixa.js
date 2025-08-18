import axios from 'axios';
import styles from './AlterarCaixa.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { AlertErro, AlertSucess } from '../../../components/Alertas';
import { Apis } from '../../../Apis';
const AlterarCaixa = () => {
    const [loading, setLoading] = useState(true);
    const [caixa, setCaixa] = useState([]);
    const navigation = useNavigate();
    const params = useParams();

    useEffect(() => {
        handleCaixas();
    }, []);

    const handleCaixas = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                }
            }

            const response = await axios.get(`${Apis.urlCaixa}/${params.caixa_id}`, requestOptions);
            setCaixa(response.data.registros[0]);
        } catch (error) {
            alert(error.response.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        if (!formValues.identificador_balanca || !formValues.observacao) {
            alert('Todos os campos devem ser preenchidos!');
            return
        }

        try {
            setLoading(true);
            const requestoptions = {
                headers: {
                    'Content-type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                }
            }

            const response = await axios.put(`${Apis.urlCaixa}/${params.caixa_id}`, formValues, requestoptions);
            AlertSucess(response?.data.retorno.mensagem);
            navigation(-1)

        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
            setLoading(false);
        }

    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className={styles.container_alterar_caixa}>
            <form onSubmit={handleSubmit}>
                <h1>ATUALIZAR CAIXA</h1>
                <label>
                    <span>Observação:</span>
                    <input type='text' name='observacao' placeholder='Insira uma observação' defaultValue={caixa?.observacao} />
                </label>
                <label>
                    <span>Identificador da Balança:</span>
                    <input type='text' name='identificador_balanca' placeholder='Insira o identificador da balança' defaultValue={caixa?.identificador_balanca} />
                </label>
                <label>
                    <span>Limite de Peso:</span>
                    <input type='text' name='limite_peso' placeholder='Insira um limite de peso para a caixa (g)' defaultValue={caixa?.limite_peso} />
                </label>
                <button>Atualizar</button>
                <div className={styles.footer}>
                    <a onClick={() => navigation(-1)}>Retornar à página anterior</a>
                </div>
            </form>
        </div>
    )
}
export default AlterarCaixa;