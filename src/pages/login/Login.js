import HeaderComponent from '../../components/HeaderComponent';
import styles from './Login.module.scss';
import { MdHive, MdChevronRight, MdMenu, MdOutlineLock, MdAdd, MdOutlineAlternateEmail, MdOutlineLockOpen } from "react-icons/md";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Apis } from '../../Apis';
import LoadingComponent from '../../components/LoadingComponent';
import { IoMdClose } from 'react-icons/io';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [openCloseOpcoes, setOpenCloseOpcoes] = useState(false);
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigation('/login');
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (!usuario || !password) {
                alert("Todos os campos devem ser preenchidos!");
                return
            }

            setLoading(true);

            const body = { email: usuario, senha: password };

            const response = await axios.post(`${Apis.urlApicultor}/login`, body);
            localStorage.setItem("@pesa_box_token", response.data.registros.token);
            localStorage.setItem("@pesa_box_nome", response.data.registros.nome);
            navigation('/')
        } catch (error) {
            alert(error.response.data.retorno.mensagem);
            setLoading(false);
        }
    }

    if (loading) return <LoadingComponent />;

    return (
        <div className={styles.container}>
            <HeaderComponent
                funcao={() => setOpenCloseOpcoes(true)}
                icone={<MdMenu />}
            />

            <div
                className={styles.scrollArea}
                style={{ overflow: openCloseOpcoes ? 'hidden' : 'auto' }}
            >
                <div className={styles.content}>
                    <form onSubmit={handleLogin} className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <span className={styles.formTitle}>Login PesaBox</span>
                            <MdHive />
                        </div>

                        <div className={styles.formDescription}>
                            <p>Bem-vindo ao PesaBox Mobile! Faça login com suas credenciais para acessar a área exclusiva e aproveitar todos os recursos da apicultura digital.</p>
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="E-mail"
                                className={styles.input}
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
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

                        <div className={styles.formFooter}>
                            <button className={styles.buttonPrimary} onClick={handleLogin}>
                                <span className={styles.buttonText}>Entrar</span>
                                <MdChevronRight size={25} color="#fff" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {openCloseOpcoes && (
                <div className={styles.optionsModal}>
                    <div className={styles.optionsList}>

                        <div
                            className={styles.optionItem}
                            onClick={() => navigation('/login/solicitar/troca/senha')}
                        >
                            <span>Esqueci Minha Senha</span>
                            <button className={styles.optionIcon} onClick={() => setOpenCloseOpcoes(false)}>
                                <MdOutlineLock />
                            </button>
                        </div>

                        <div
                            className={styles.optionItem}
                            onClick={() => navigation('/login/apicultor/cadastrar')}
                        >
                            <span>Criar Nova Conta</span>
                            <button className={styles.optionIcon} onClick={() => setOpenCloseOpcoes(false)}>
                                <MdAdd />
                            </button>
                        </div>

                        <div className={styles.optionItem}>
                            <span>Fechar</span>
                            <button className={styles.optionIcon} onClick={() => setOpenCloseOpcoes(false)}>
                                <IoMdClose />
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;