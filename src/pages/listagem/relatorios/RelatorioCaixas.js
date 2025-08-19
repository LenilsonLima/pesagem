import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Header from '../../../components/Header';
import styles from './RelatorioCaixas.module.scss';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertErro } from '../../../components/Alertas';
import Loading from '../../../components/Loading';
import { Apis } from '../../../Apis';
import PesosPdf from './PesosPdf';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const RelatorioCaixas = () => {
    const [loading, setLoading] = useState(true);
    const [pesos, setPesos] = useState([]);
    const date = new Date();
    const navigation = useNavigate();
    const data_inicial = String(date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, 0) + '-01');
    const data_final = String(date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, 0) + '-' + String(date.getDate()).padStart(2, 0));
    const [dataIncial, setDataIncial] = useState(data_inicial);
    const [dataFinal, setDataFinal] = useState(data_final);
    const params = useParams();

    useEffect(() => {
        handlePeso();
    }, []);

    const handlePeso = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesagem_token')}`
                }
            }

            const response = await axios.get(`${Apis.urlPesoCaixa}/${params?.caixa_id}/${dataIncial}/${dataFinal}`, requestOptions);
            setPesos(response.data.registros);
            console.log(response.data.registros);

        } catch (error) {
            AlertErro(error.response.data.retorno.mensagem);
            console.log(error.response.data);
            setPesos([]);
        } finally {
            setLoading(false);
        }
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `Relatório de Pesos | ${String(dataIncial).split('-').reverse().join('/')} à ${String(dataFinal).split('-').reverse().join('/')}`,
            },
        },
    };

    // Gerando as labels (por exemplo, "1", "2", ..., "22")
    const labels = pesos.map((_, index) => (index + 1).toString());

    // Gerando os dados do gráfico com base no array de pesos
    const data = {
        labels,
        datasets: [
            {
                label: 'Pesos',
                data: pesos.map(item => parseFloat(item.peso_atual)),  // Convertendo peso_atual para float
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(153, 155, 156, 0.5)',
            },
        ],
    };
    if (loading) {
        return <Loading />;
    }
    return (
        <div className={styles.view_relatorio}>
            <Header />
            <div className={styles.container_relatorio_caixas}>
                <div className={styles.container_filtro}>
                    <label className={styles.label_friltro}>
                        <input type='date' defaultValue={dataIncial} onChange={(e) => setDataIncial(e.target.value)} />
                    </label>

                    <label className={styles.label_friltro}>
                        <input type='date' defaultValue={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />
                    </label>
                    <button onClick={handlePeso}>Aplicar Filtro</button>
                    <button onClick={() => navigation(`/caixa/relatorio/pdf/${params.caixa_id}/${dataIncial}/${dataFinal}`)}>PDF</button>
                </div>
                {pesos?.length > 0 &&
                    <Line options={options} data={data} className={styles.grafico} />
                }
            </div>
        </div>
    );
};

export default RelatorioCaixas;
