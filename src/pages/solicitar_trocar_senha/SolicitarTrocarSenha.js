import HeaderComponent from '../../components/HeaderComponent';
import styles from './SolicitarTrocarSenha.module.scss';
import { MdHive, MdChevronRight, MdOutlineAlternateEmail, MdClose } from "react-icons/md";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Apis } from '../../Apis';
import LoadingComponent from '../../components/LoadingComponent';

const SolicitarTrocarSenha = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const navigation = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {

            if (!email) {
                return alert("Por favor, preencha todos os campos para prosseguir.");
            }
            setLoading(true);

            const body = { email: email };

            const response = await axios.post(`${Apis.urlApicultor}/token_senha`, body);
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
                            <span className={styles.formTitle}>Redefinir Senha</span>
                            <MdHive />
                        </div>

                        <div className={styles.formDescription}>
                            <p>Informe o e-mail que você utiliza para acessar o sistema. Enviaremos um link com instruções para que você possa redefinir sua senha com segurança.</p>
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
                            <button className={styles.buttonPrimary} onClick={handleLogin}>
                                <span className={styles.buttonText}>Solicitar</span>
                                <MdChevronRight size={25} color="#fff" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SolicitarTrocarSenha;