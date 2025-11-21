import HeaderComponent from '../../components/HeaderComponent';
import styles from './AnaliseIA.module.scss';
import { MdHive, MdClose } from "react-icons/md";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Apis } from '../../Apis';
import LoadingComponent from '../../components/LoadingComponent';
import { AiOutlineReload } from 'react-icons/ai';

const AnaliseIA = () => {
    const [loading, setLoading] = useState(false);
    const [registrosAnaliseIA, setRegistrosAnaliseIA] = useState([]);
    const params = useParams();
    const { observacao, data_inicial, data_final, caixa_id } = params;
    const navigation = useNavigate();

    useEffect(() => {
        requestAnaliseIA();
    }, []);
    const requestAnaliseIA = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                },
                params: { data_inicial, data_final, caixa_id }
            };

            const response = await axios.get(`${Apis.urlPesoCaixaPDF}/analise-ia`, requestOptions);
            alert(`Sugestões geradas por IA no período de ${String(data_inicial).split('-').reverse().join('/')} à ${String(data_final).split('-').reverse().join('/')}.\n\nOs dados devem ser analisados cuidadosamente antes de qualquer ação.`);
            setRegistrosAnaliseIA(response.data.registros);
            console.log(response.data.registros);
        } catch (error) {
            console.log(error.response.data);
            alert(error.response.data.retorno.mensagem || 'Erro ao realizar análise, tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingComponent />;

    return (
        <div className={styles.container}>
            <HeaderComponent
                funcao={requestAnaliseIA}
                icone={<AiOutlineReload />}
            />

            <div className={styles.scrollArea}>
                <div className={styles.content}>
                    <div className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <span className={styles.formTitle}>Análise Com IA</span>
                            <MdHive />
                        </div>

                        <div className={styles.formDescription}>
                            <p style={{ textTransform: 'uppercase' }}>{params?.observacao}</p>
                            <br />
                            <p style={{ textTransform: 'uppercase' }}>Tendencia: {registrosAnaliseIA?.tendencia}</p>
                        </div>

                        {registrosAnaliseIA.ajustes?.map((item, index) => (
                            <div className={styles.formDescription} key={index}>
                                <p style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{item?.nivel}</p>
                                <br />
                                <p>{item?.texto}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnaliseIA;