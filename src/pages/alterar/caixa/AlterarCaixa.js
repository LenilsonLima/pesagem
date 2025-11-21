import styles from './AlterarCaixa.module.scss';
import { MdHive, MdChevronRight, MdClose, MdOutlineAlternateEmail, MdEventNote } from "react-icons/md";
import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Apis } from '../../../Apis';
import LoadingComponent from '../../../components/LoadingComponent';
import HeaderComponent from '../../../components/HeaderComponent';

const AlterarCaixa = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const { state } = useLocation();
    const caixa = state?.caixa;
    const [observacao, setObservacao] = useState(caixa?.observacao);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                }
            };

            if (!observacao) {
                return alert("Por favor, preencha todos os campos para prosseguir.");
            }
            setLoading(true);

            const body = { caixa_id: caixa?.id, observacao: observacao, identificador_balanca: caixa?.identificador_balanca };

            const response = await axios.put(`${Apis.urlCaixa}`, body, requestOptions);
            alert(response.data.retorno.mensagem);
            navigation(-1);
        } catch (error) {
            alert(error.response.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingComponent />;

    return (
        <div className={styles.container}>
            <HeaderComponent
                funcao={() => navigation(-1)}
                icone={<MdClose />}
            />

            <div className={styles.scrollArea}>
                <div className={styles.content}>
                    <form onSubmit={handleLogin} className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <span className={styles.formTitle}>ATUALIZAR CAIXA</span>
                            <MdHive />
                        </div>

                        <div className={styles.formDescription}>
                            <p>Atualize as informações da caixa para manter o monitoramento das colmeias preciso e garantir o bom funcionamento do sistema.</p>
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Observação"
                                className={styles.input}
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                            />
                            <MdEventNote className={styles.inputIcon} />
                        </div>

                        <div className={styles.formFooter}>
                            <button className={styles.buttonPrimary} onClick={handleLogin}>
                                <span className={styles.buttonText}>Salvar Alteração</span>
                                <MdChevronRight size={25} color="#fff" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AlterarCaixa;