import axios from 'axios';
import styles from './ListarCaixas.module.scss';
import { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from "react-icons/fi";
import Loading from '../../../components/Loading';
import { AlertConfirm, AlertErro, AlertSucess } from '../../../components/Alertas';
import { Apis } from '../../../Apis';
import img_sem_registros from '../../../assets/fundo.png';

const ListarCaixas = () => {
    const [caixas, setCaixas] = useState([]);
    const [filtrar, setFiltrar] = useState(false);
    const [pesquisar, setPesquisar] = useState('');
    const [statusCaixaFiltro, setStatusCaixaFiltro] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigate();

    useEffect(() => {
        handleCaixas();
    }, [filtrar]);

    const handleCaixas = async () => {
        try {
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                },
            }

            const params = {
                obs_identificador: pesquisar,
                status_caixa_peso: statusCaixaFiltro
            };

            setLoading(true);

            // const response = await axios.get(`${Apis.urlCaixa}/filtro?obs_identificador=${pesquisar}`, requestOptions);
            const response = await axios.get(`http://localhost:5000/caixa/filtro`, { ...requestOptions, params: params });

            setCaixas(response.data.registros);
        } catch (error) {
            setCaixas([]);
            AlertErro(error.response.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    }
    const handleRemoverCaixaConfirme = async (caixa_id) => {
        AlertConfirm('Ao clicar em confirmar, você concorda em remover a caixa e todos os dados vinculados a ela da nossa base de dados, essa ação não poderá ser revertida.', () => handleRemoverCaixa(caixa_id));
    }
    const handleRemoverCaixa = async (caixa_id) => {
        try {
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                }
            }
            setLoading(true);
            const response = await axios.delete(`${Apis.urlCaixa}/${caixa_id}`, requestOptions);
            AlertSucess(response.data.retorno.mensagem);
            handleCaixas();
        } catch (error) {
            AlertErro(error.response.data.retorno.mensagem);
            setLoading(false);
        }
    }
    if (loading) {
        return <Loading />
    }
    return (
        <div className={styles.view_caixas}>
            <Header setLoading={setLoading} />
            <div className={styles.container_filtro}>
                <label className={styles.label_filtro}>
                    <input
                        value={pesquisar} onChange={(e) => setPesquisar(e.target.value)}
                        type='text'
                        placeholder='Informe o ID ou a observação para pesquisar...'
                    />
                </label>
                <label className={styles.label_filtro}>
                    <select value={statusCaixaFiltro} onChange={(e) => setStatusCaixaFiltro(e.target.value)}>
                        <option value={0}>- mostrar todos -</option>
                        <option value={1}>Prontos para coleta</option>
                        <option value={2}>Abaixo do peso de coleta</option>
                    </select>
                </label>
                <button onClick={() => setFiltrar(prevent => !prevent)}>Aplicar filtro</button>
            </div>
            <div className={styles.container_listar_caixas}>
                {
                    caixas?.length > 0 ?
                        <div className={styles.area_card_caixa}>
                            {caixas?.map((item) => (
                                <div style={{ border: parseFloat(item?.peso_atual) >= parseFloat(item?.limite_peso) ? 'solid 2px green' : 'none' }} key={item?.id} className={styles.card_caixa} title={`Visualizar gráfico da caixa ${item?.id}`}>
                                    <div className={styles.card_click} onClick={item?.peso_atual ? () => navigation(`/caixa/relatorio/${item?.id}`) : () => AlertErro(`Peso não registrado para a caixa ${item?.id}`)} />
                                    <span className={styles.identificador_balanca}>{item?.identificador_balanca}</span>
                                    <span className={styles.observacao}>Observação: {item?.observacao}</span>
                                    <span className={styles.criado_em}>Criado em: {String(item?.criado_em).substring(0, 10).split('-').reverse().join('/')}</span>
                                    <span className={styles.observacao}>Peso atual: {item?.peso_atual ? parseFloat(item?.peso_atual).toFixed(2) : 'Não medido'}</span>
                                    <span className={styles.observacao}
                                        style={{ color: parseFloat(item?.peso_atual) >= parseFloat(item?.limite_peso) ? 'green' : '#000', fontWeight: '700' }}
                                    >LIMITE DE PESO: {item?.limite_peso ? parseFloat(item?.limite_peso).toFixed(2) : 0.00} {parseFloat(item?.peso_atual) >= parseFloat(item?.limite_peso).toFixed(2) && "| PRONTO PARA COLETAR"}</span>
                                    <div className={styles.btns_card}>
                                        <button className={styles.alterar} onClick={() => navigation(`/caixa/alterar/${item?.id}`)}>alterar</button>
                                        <button onClick={() => handleRemoverCaixaConfirme(item?.id)}>remover</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        :
                        <img src={img_sem_registros} alt="sem registros" className={styles.img_sem_registros} />
                }
                <button title='Adicionar nova caixa' className={styles.btn_add_caixa} onClick={() => navigation('/caixa/create')}>
                    <FiPlus />
                </button>
            </div>
        </div>
    )
}
export default ListarCaixas;