import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { TbUserHexagon } from "react-icons/tb";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { MdLogout } from "react-icons/md";
import { RiHome9Line } from "react-icons/ri";

const Header = () => {
    const navigation = useNavigate();
    const location = useLocation();
    const handleSair = () => {
        localStorage.clear();
        navigation('/login', { replace: true });
    }
    return (
        <div className={styles.container_header}>
            <div className={styles.info_user}>
                <button onClick={() => navigation('/apicultor/alterar')}>
                    <TbUserHexagon className={styles.icone_user} />
                    <HiOutlinePencilAlt className={styles.icone_editar} />
                </button>
                <span>{localStorage.getItem('@pesagem_nome')}</span>
            </div>
            <div className={styles.btns_menu}>
                {location.pathname != '/home' &&
                    <button title='Ir para a tela inicial'>
                        <RiHome9Line onClick={() => navigation('/home')} />
                    </button>
                }
                <button title='Sair do sistema'>
                    <MdLogout onClick={() => handleSair()} />
                </button>
            </div>
        </div>
    )
}
export default Header;