import HeaderComponent from '../../components/HeaderComponent';
import styles from './Home.module.scss';
import { MdHive, MdChevronRight, MdMenu, MdModeEdit, MdOutlineClose, MdDelete } from "react-icons/md";
import colmeia from "../../assets/colmeia.png";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Apis } from '../../Apis';
import LoadingComponent from '../../components/LoadingComponent';
import { IoMdClose, IoMdSearch } from 'react-icons/io';
import { AiOutlineReload } from 'react-icons/ai';
import { IoBarChartOutline } from 'react-icons/io5';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { FiUser } from 'react-icons/fi';
import { LuFilter, LuFilterX } from 'react-icons/lu';

const Home = () => {
    const [caixas, setCaixas] = useState([]);
    const [filtrar, setFiltrar] = useState(false);
    const [pesquisar, setPesquisar] = useState('');
    const [pesquisarVisible, setPesquisarVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openCloseOpcoes, setOpenCloseOpcoes] = useState(false);
    const [openCloseDados, setOpenCloseDados] = useState(false);
    const [caixaClicada, setCaixaClicada] = useState({});
    const navigation = useNavigate();

    useEffect(() => {
        if (pesquisar) {
            const intevalo = setTimeout(() => {
                handleCaixas();
            }, 500);
            return () => clearTimeout(intevalo);
        } else {
            handleCaixas();
        }
    }, [filtrar, pesquisar]);

    const handleLogout = () => {
        localStorage.clear();
        navigation('/login');
    }
    const handleCaixas = async () => {
        try {
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                },
                params: {
                    obs_identificador: pesquisar
                }
            };

            setLoading(true);

            const response = await axios.get(`${Apis.urlCaixa}/filtro`, requestOptions);

            setCaixas(response.data.registros);
        } catch (error) {
            setCaixas([]);
            alert(error.response.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    }
    const handleAlterarCaixa = () => {
        navigation('/caixa/alterar', { state: { caixa: caixaClicada } });
    }
    const handleRemoverFiltro = () => {
        setPesquisar('')
        setPesquisarVisible(!pesquisarVisible)
    }

    const handleConfirmarExcluirCaixa = () => {
        setOpenCloseDados(false);
        const confirm = window.confirm(`Tem certeza que deseja excluir a caixa "${caixaClicada?.observacao}"? Essa ação também removerá todos os pesos vinculados e não poderá ser desfeita.`)
        if (confirm) {
            handleDeletarCaixa();
        }
    }
    const handleDeletarCaixa = async () => {
        try {
            setLoading(true);

            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                },
                params: { caixa_id: caixaClicada?.id }
            };

            const response = await axios.delete(Apis.urlCaixa, requestOptions);

            alert(response.data?.retorno?.mensagem || "Caixa excluída com sucesso!");
            handleCaixas();
        } catch (error) {
            console.log("Erro ao excluir caixa:", error);
            const msg = error.response?.data?.retorno?.mensagem || "Não foi possível excluir a caixa. Tente novamente.";
            alert(msg);
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <LoadingComponent />
        )
    }
    return (
        <div className={styles.home}>
            <HeaderComponent
                funcao={() => setOpenCloseOpcoes(true)}
                icone={<MdMenu />}
            />
            {caixas?.length > 0 ?
                <div
                    className={styles.homeScroll}
                    style={{ overflow: openCloseDados || openCloseOpcoes ? 'hidden' : 'auto' }}
                >
                    <div className={styles.homeContent}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <span className={styles.cardTitle}>Listagem de Caixas</span>
                                <MdHive />
                            </div>
                            <div className={styles.cardDescription}>
                                <p>Veja abaixo as caixas sincronizadas com o servidor. Clique em uma caixa para reconfigurar, trocar componentes ou editar a rede. Para adicionar uma nova caixa, toque no botão abaixo.</p>
                            </div>
                        </div>

                        <div className={styles.card}>
                            {caixas?.map((item, index) => (
                                <button key={item?.id}
                                    onClick={() => {
                                        setCaixaClicada(item);
                                        setOpenCloseDados(true);
                                    }}
                                    className={styles.caixaGroup}
                                    style={{ borderTopWidth: index === 0 ? 0 : 1 }}
                                >
                                    <div className={styles.caixaContent}>
                                        <div className={styles.caixaIconWrapper}>
                                            <img src={colmeia} className={styles.caixaImage} />
                                        </div>
                                        <div className={styles.caixaBody}>
                                            <span className={styles.caixaTitle}>{item?.observacao}</span>
                                            <span
                                                className={styles.caixaStatus}
                                                style={{ color: parseFloat(item?.peso_atual) >= parseFloat(item?.limite_peso) ? '#56a368ff' : '#cb2027' }}
                                            >
                                                {parseFloat(item?.peso_atual) >= parseFloat(item?.limite_peso) ? 'Pronto para coleta' : 'Peso insuficiente para coleta'}
                                            </span>
                                            <span className={styles.caixaIdentificacao}>{item?.identificador_balanca}</span>
                                        </div>
                                    </div>
                                    <MdChevronRight className={styles.caixaIcon} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                :
                <div className={styles.sem_registros}>
                    <p>Nenhuma caixa foi localizada, altere o filtro ou adicione uma nova caixa e tente novamente.</p>
                </div>
            }
            {openCloseOpcoes &&
                <div className={styles.opcoesContainer}>
                    {pesquisarVisible &&
                        <div className={styles.area_form}>
                            <label>
                                <input
                                    type='text'
                                    placeholder='Observação ou identificador'
                                    value={pesquisar}
                                    onChange={(e) => setPesquisar(e.target.value)}
                                />
                                {pesquisar?.length > 0 ?
                                    <MdOutlineClose onClick={() => setPesquisar('')} />
                                    :
                                    <IoMdSearch />
                                }
                            </label>
                        </div>
                    }
                    <div className={styles.area_btn}>
                        <div
                            className={styles.area_btn_text}
                            onClick={() => {
                                setFiltrar(!filtrar);
                                setOpenCloseOpcoes(false);
                            }}
                        >
                            <span>Recarregar Dados</span>
                            <button
                                className={styles.btn_opcao}
                            >
                                <AiOutlineReload />
                            </button>
                        </div>

                        <div
                            className={styles.area_btn_text}
                            onClick={() => navigation('/apicultor/alterar')}
                        >
                            <span>Meus Dados</span>
                            <button className={styles.btn_opcao}>
                                <FiUser />
                            </button>
                        </div>

                        <div
                            className={styles.area_btn_text}
                            onClick={() => {
                                pesquisarVisible ?
                                    handleRemoverFiltro()
                                    :
                                    setPesquisarVisible(!pesquisarVisible)
                            }}
                        >
                            <span>
                                {pesquisarVisible ?
                                    'Remover filtro'
                                    :
                                    'Filtrar Caixas'
                                }
                            </span>
                            <button className={styles.btn_opcao}>
                                {pesquisarVisible ?
                                    <LuFilterX size={22} />
                                    :
                                    <LuFilter size={22} />
                                }
                            </button>
                        </div>

                        <div
                            className={styles.area_btn_text}
                            onClick={handleLogout}
                        >
                            <span>Fazer Logout</span>
                            <button className={styles.btn_opcao}>
                                <RiLogoutCircleRLine />
                            </button>
                        </div>

                        <div className={styles.area_btn_text} onClick={() => setOpenCloseOpcoes(false)}>
                            <span>Fechar</span>
                            <button className={styles.btn_opcao}>
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
                </div>
            }


            {openCloseDados &&
                <div className={styles.opcoesContainer}>
                    <div className={styles.area_btn}>
                        <div className={styles.area_btn_text} onClick={() => navigation(`/pesos/grafico/${caixaClicada?.id}/${caixaClicada?.observacao}`)}>
                            <span>Gráfico de Pesos</span>
                            <button className={styles.btn_opcao}>
                                <IoBarChartOutline size={20} />
                            </button>
                        </div>

                        <div
                            className={styles.area_btn_text}
                            onClick={handleConfirmarExcluirCaixa}
                        >
                            <span>Excluir Caixa</span>
                            <button className={styles.btn_opcao}>
                                <MdDelete />
                            </button>
                        </div>

                        <div
                            className={styles.area_btn_text}
                            onClick={handleAlterarCaixa}
                        >
                            <span>Alterar Caixa</span>
                            <button className={styles.btn_opcao}>
                                <MdModeEdit size={20} />
                            </button>
                        </div>

                        <div className={styles.area_btn_text} onClick={() => setOpenCloseDados(false)}>
                            <span>Fechar</span>
                            <button className={styles.btn_opcao}>
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Home;
