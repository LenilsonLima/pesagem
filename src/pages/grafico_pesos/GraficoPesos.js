import { useEffect, useState } from 'react';
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
import HeaderComponent from '../../components/HeaderComponent';
import styles from './GraficoPesos.module.scss';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingComponent from '../../components/LoadingComponent';
import { Apis } from '../../Apis';
import { MdChevronRight, MdHive, MdMenu, MdPictureAsPdf } from 'react-icons/md';
import { IoMdClose } from 'react-icons/io';
import { RiRobot2Line } from 'react-icons/ri';
import { AiOutlineReload } from 'react-icons/ai';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const GraficoPesos = () => {
    const [openCloseDados, setOpenCloseDados] = useState(false);
    const [loading, setLoading] = useState(true);
    const [diferenca, setDiferenca] = useState(0);
    const [limitePeso, setLimitePeso] = useState(0);
    const [pesoAtual, setpesoAtual] = useState(0);
    const [grafico, setGrafico] = useState(null);
    const date = new Date();
    const [dataIncial, setDataIncial] = useState(String(date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, 0) + '-01'));
    const ultimoDia = new Date(date.getFullYear(), parseInt(dataIncial.substring(5, 7)), 0).getDate()
    const [dataFinal, setDataFinal] = useState(String(date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, 0) + '-' + ultimoDia));
    const params = useParams();
    const navigation = useNavigate();

    useEffect(() => {
        handlePeso();
    }, []);


    const handlePeso = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                },
                params: {
                    caixa_id: params.caixa_id,
                    data_inicial: dataIncial,
                    data_final: dataFinal
                }
            };

            const response = await axios.get(Apis.urlPesoCaixa, requestOptions);

            setDiferenca(parseFloat(response.data.registros?.peso_atual) - parseFloat(response.data.registros?.limite_peso));
            setLimitePeso(response.data.registros?.limite_peso);
            setpesoAtual(response.data.registros?.peso_atual);

            // Garantir estrutura mínima
            let labels = [];
            response.data.registros?.datasets[0]?.data?.map((item, index) => {
                labels = [...labels, index + 1]
            });

            setGrafico({
                labels: labels || [],
                datasets: Array.isArray(response.data.registros?.datasets) ? response.data.registros?.datasets : [],
                legend: response.data.registros?.legend || []
            });

        } catch (error) {
            alert(error.response?.data?.retorno?.mensagem || "Erro ao carregar dados");
            console.log(error.response?.data);
            setGrafico(null);
        } finally {
            setLoading(false);
        }
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
                text: `Relatório de Pesos | ${String(dataIncial).split('-').reverse().join('/')} à ${String(dataFinal).split('-').reverse().join('/')}`,
            },
        },
    };

    // NÃO QUEBRA MESMO SE datasets vier vazio
    const data = grafico ? {
        labels: grafico.labels || [],
        datasets: (grafico.datasets || []).map((ds, index) => ({
            label: grafico.legend?.[index] || `Linha ${index + 1}`,
            data: (ds.data || []).map(v => parseFloat(v)),
            borderColor: index === 0 ? 'rgb(53,162,235)' : 'rgb(255,99,132)',
            backgroundColor: 'rgba(153,155,156,0.5)',
            borderWidth: 2,
            tension: 0.3
        }))
    } : null;

    if (loading) {
        return <LoadingComponent />;
    }

    const handleFormatarData = (data) => {
        const data_formatada = String(data).split('-').reverse().join('/')
        return data_formatada;
    }

    return (
        <div className={styles.home}>
            <HeaderComponent funcao={() => setOpenCloseDados(true)} icone={<MdMenu />} />
            <div className={styles.homeScroll}>
                <div className={styles.homeContent}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Listagem de Caixas</span>
                            <MdHive />
                        </div>
                        <div className={styles.cardDescription}>
                            <p style={{ textTransform: 'uppercase' }}>{params?.observacao}</p>
                            <br />
                            <p>
                                Veja abaixo os pesos registrados no período de {handleFormatarData(dataIncial)} a {handleFormatarData(dataFinal)}.
                            </p>
                            <p>
                                Cada ponto representa o peso da caixa em um dia.
                            </p>
                        </div>
                    </div>

                    <div className={styles.card} style={{ padding: 10 }}>
                        <div className={styles.container_filtro}>
                            <input onKeyDown={(e) => e.preventDefault()} type='date' defaultValue={dataIncial} onChange={(e) => setDataIncial(e.target.value)} />

                            <input onKeyDown={(e) => e.preventDefault()} type='date' defaultValue={dataFinal} onChange={(e) => setDataFinal(e.target.value)} />

                            <button
                                className={styles.buttonPrimary}
                                onClick={() => {
                                    handlePeso();
                                    setOpenCloseDados(false);
                                }}
                            >
                                <span className={styles.buttonText}>Aplicar Filtro</span>
                                <MdChevronRight size={25} color="#fff" />
                            </button>
                        </div>
                    </div>
                    {grafico && grafico.labels?.length > 0 ?
                        (
                            <>
                                <div className={styles.card}>
                                    <div className={styles.headerBox}>
                                        <div className={styles.headerItem}>
                                            <span className={styles.headerLabel}>Peso atual</span>
                                            <span className={styles.headerValue}>{pesoAtual} kg</span>
                                        </div>
                                        <div className={styles.headerItem}>
                                            <span className={styles.headerLabel}>Limite</span>
                                            <span className={styles.headerValue}>{limitePeso} kg</span>
                                        </div>
                                        <div className={styles.headerItem}>
                                            <span className={styles.headerLabel}>Diferença</span>
                                            <span
                                                className={styles.headerValue}
                                                style={{ color: diferenca >= 0 ? '#3cb371' : '#d9534f' }}
                                            >
                                                {parseFloat(diferenca).toFixed(3)} kg
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.card} style={{ padding: 20 }}>
                                    <Line options={options} data={data} className={styles.grafico} />
                                </div>

                            </>
                        )

                        :
                        <div className={styles.sem_registros}>
                            <p>Nenhuma informação foi localizada, altere o filtro e tente novamente.</p>
                        </div>
                    }
                </div>
            </div>

            {openCloseDados &&
                <div className={styles.opcoesContainer}>
                    <div className={styles.area_btn}>
                        <div
                            className={styles.area_btn_text}
                            onClick={() => {
                                handlePeso();
                                setOpenCloseDados(false);
                            }}
                        >
                            <span>Recarregar Dados</span>
                            <button className={styles.btn_opcao}>
                                <AiOutlineReload />
                            </button>
                        </div>

                        {grafico?.datasets?.length > 0 &&
                            <>
                                <div className={styles.area_btn_text} onClick={() => navigation(`/pesos/analise-ia/${params?.caixa_id}/${dataIncial}/${dataFinal}/${params?.observacao}`)}>
                                    <span>Sugestões Com IA</span>
                                    <button className={styles.btn_opcao}>
                                        <RiRobot2Line />
                                    </button>
                                </div>

                                <div
                                    className={styles.area_btn_text}
                                    onClick={() => navigation(`/pesos/pdf/${params?.caixa_id}/${dataIncial}/${dataFinal}`)}
                                >
                                    <span>Gerar PDF</span>
                                    <button className={styles.btn_opcao}>
                                        <MdPictureAsPdf />
                                    </button>
                                </div>
                            </>
                        }

                        <div
                            className={styles.area_btn_text}
                            onClick={() => {
                                setOpenCloseDados(false);
                            }}
                        >
                            <span>Fechar</span>
                            <button className={styles.btn_opcao}>
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default GraficoPesos;