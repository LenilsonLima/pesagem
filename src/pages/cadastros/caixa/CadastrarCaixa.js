import axios from 'axios';
import styles from './CadastrarCaixa.module.scss';
import { useState } from 'react';
import Loading from '../../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { AlertErro, AlertSucess } from '../../../components/Alertas';
import { Apis } from '../../../Apis';

const CadastrarCaixa = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const formValues = Object.fromEntries(formData);

        if (!formValues.identificador_balanca || !formValues.observacao) {
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

            const response = await axios.post(Apis.urlCaixa, formValues, requestoptions);
            console.log(response.data.retorno);
            AlertSucess(response?.data.retorno.mensagem);

        } catch (error) {
            AlertErro(error.response?.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className={styles.container_caixa}>
            <form onSubmit={handleSubmit}>
                <h1>CRIAR CAIXA</h1>
                <label>
                    <span>Observação:</span>
                    <input type='text' name='observacao' placeholder='Insira uma observação' />
                </label>
                <label>
                    <span>Identificador Balança:</span>
                    <input type='text' name='identificador_balanca' placeholder='Insira o identificador da balança' />
                </label>
                <label>
                    <span>Limite de Peso:</span>
                    <input type='number' name='limite_peso' placeholder='Insira um limite de peso para a caixa (g)' />
                </label>
                <button>Cadastrar</button>
                <div className={styles.footer}>
                    <a onClick={() => navigation(-1)}>Retornar à página anterior</a>
                </div>
            </form>
        </div>
    )
}
export default CadastrarCaixa;