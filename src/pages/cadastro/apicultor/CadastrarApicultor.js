import HeaderComponent from '../../../components/HeaderComponent';
import styles from './CadastrarApicultor.module.scss';
import { MdHive, MdChevronRight, MdOutlineLock, MdOutlineAlternateEmail, MdOutlineLockOpen, MdClose } from "react-icons/md";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Apis } from '../../../Apis';
import LoadingComponent from '../../../components/LoadingComponent';
import { FiUser } from 'react-icons/fi';

const CadastrarApicultor = () => {
    const [loading, setLoading] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmarpassword, setConfirmarpassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (password?.length < 4 || password != confirmarpassword) {
                return alert("Os campos senha e confirmar senha devem se iguais e conter ao menos 4 caracteres.");
            }

            if (!nome || !email) {
                return alert("Por favor, preencha todos os campos para prosseguir.");
            }
            setLoading(true);

            const body = { nome: nome, email: email, senha: password };

            const response = await axios.post(`${Apis.urlApicultor}`, body);
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
                            <span className={styles.formTitle}>Criar Apicultor</span>
                            <MdHive />
                        </div>

                        <div className={styles.formDescription}>
                            <p>Preencha os campos abaixo para cadastrar um novo apicultor no sistema.</p>
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

                        <div className={styles.inputGroup}>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Senha"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordVisible ? (
                                <MdOutlineLockOpen
                                    className={styles.inputIcon}
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                />
                            ) : (
                                <MdOutlineLock
                                    className={styles.inputIcon}
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                />
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                placeholder="Confirmar Senha"
                                className={styles.input}
                                value={confirmarpassword}
                                onChange={(e) => setConfirmarpassword(e.target.value)}
                            />
                            {passwordVisible ? (
                                <MdOutlineLockOpen
                                    className={styles.inputIcon}
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                />
                            ) : (
                                <MdOutlineLock
                                    className={styles.inputIcon}
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                />
                            )}
                        </div>

                        <div className={styles.formFooter}>
                            <button className={styles.buttonPrimary} onClick={handleLogin}>
                                <span className={styles.buttonText}>Cadastrar</span>
                                <MdChevronRight size={25} color="#fff" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CadastrarApicultor;