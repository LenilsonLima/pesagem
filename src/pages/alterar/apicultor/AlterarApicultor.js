import styles from './AlterarApicultor.module.scss';
import { MdHive, MdChevronRight, MdClose, MdOutlineAlternateEmail, MdBlock } from "react-icons/md";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Apis } from '../../../Apis';
import LoadingComponent from '../../../components/LoadingComponent';
import HeaderComponent from '../../../components/HeaderComponent';
import { FiUser } from 'react-icons/fi';

const AlterarApicultor = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');

    const handleDadosApicultor = async () => {
        try {
            setLoading(true);
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                }
            };
            const response = await axios.get(Apis.urlApicultor, requestOptions);

            setNome(response.data.registros[0]?.nome || '');
            setEmail(response.data.registros[0]?.email || '');
            setLoading(false);
        } catch (error) {
            alert(error.response?.data?.retorno?.mensagem || 'Erro ao carregar dados do apicultor.');
            navigation(-1);
        }
    };

    useEffect(() => {
        handleDadosApicultor();
    }, []);

    const handleAlterarApicultor = async (e) => {
        e.preventDefault();
        try {
            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                }
            };

            if (!nome || !email) {
                return alert("Por favor, preencha todos os campos para prosseguir.");
            }
            setLoading(true);

            const body = { nome: nome, email: email };

            const response = await axios.put(Apis.urlApicultor, body, requestOptions);
            localStorage.setItem("@pesa_box_nome", nome);
            alert(response.data.retorno.mensagem);
            navigation(-1);
        } catch (error) {
            alert(error.response.data.retorno.mensagem);
        } finally {
            setLoading(false);
        }
    }

    const handleConfirmarDesativarUser = () => {
        const confirm = window.confirm('Ao confirmar, você concorda em desativar este usuário e bloquear todas as suas permissões de acesso na plataforma')
        if (confirm) {
            handleDesativarConta()
        }
    }

    const handleDesativarConta = async () => {
        try {
            setLoading(true);

            const requestOptions = {
                headers: {
                    'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('@pesa_box_token')}`
                }
            };

            const response = await axios.put(`${Apis.urlApicultor}/block`, {}, requestOptions);

            localStorage.clear();
            alert(response?.data?.retorno?.mensagem);
            navigation("/login");
        } catch (error) {
            console.log(error?.response?.data || error.message);
            const mensagem = error.response?.data?.retorno?.mensagem || 'Erro ao desativar conta, tente novamente.';
            alert(mensagem);
            setLoading(false);
        }
    };

    if (loading) return <LoadingComponent />;

    return (
        <div className={styles.container}>
            <HeaderComponent
                funcao={handleConfirmarDesativarUser}
                icone={<MdBlock color='#cb2027' title='Bloquear usuário' />}
            />

            <div className={styles.scrollArea}>
                <div className={styles.content}>
                    <form onSubmit={handleAlterarApicultor} className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <span className={styles.formTitle}>ATUALIZAR APICULTOR</span>
                            <MdHive />
                        </div>

                        <div className={styles.formDescription}>
                            <p>Atualize as informações do apicultor para manter os dados sempre corretos e garantir o bom funcionamento do sistema de monitoramento das colmeias.</p>
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder="Nome"
                                className={styles.input}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            <FiUser className={styles.inputIcon} />
                        </div>


                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="E-mail"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <MdOutlineAlternateEmail className={styles.inputIcon} />
                        </div>

                        <div className={styles.formFooter}>
                            <button className={styles.buttonPrimary} onClick={handleAlterarApicultor}>
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

export default AlterarApicultor;