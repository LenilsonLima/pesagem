import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.scss';
import { TbUserHexagon } from "react-icons/tb";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from 'react';
import { IoIosArrowForward } from "react-icons/io";
import { CgMenuRight } from "react-icons/cg";

const Header = ({ pesquisar, setPesquisar, setLoading }) => {
    const navigation = useNavigate();
    const [menu, setMenu] = useState(false);
    const [openClosePesquisar, setOpenClosePesquisar] = useState(pesquisar ? true : false);
    const location = useLocation();


    const handleSair = () => {
        localStorage.clear();
        navigation('/login', { replace: true });
    }
    return (
        <div className={styles.container_header}>
            <div className={openClosePesquisar ? styles.info_user_menu : styles.info_user}>
                <button onClick={() => navigation('/apicultor/alterar')}>
                    <TbUserHexagon className={styles.icone_user} />
                    <HiOutlinePencilAlt className={styles.icone_editar} />
                </button>
                <span>{localStorage.getItem('@pesagem_nome')}</span>
            </div>
            <div className={styles.btns_menu}>
                {openClosePesquisar ?
                    <div className={styles.input_pesquisar}>
                        <input type='text' defaultValue={pesquisar} onChange={(e) => setPesquisar(e.target.value)} placeholder='Informe o ID ou a observação para pesquisar...' />
                        <IoCloseOutline onClick={() => {
                            setPesquisar('');
                            setOpenClosePesquisar(false);
                            pesquisar && setLoading(true);
                        }} />
                    </div>
                    :
                    <>
                        {location.pathname === '/home' && <IoIosSearch onClick={() => setOpenClosePesquisar(true)} />}
                        <CgMenuRight onClick={() => setMenu(true)} />
                    </>
                }
            </div>
            {menu &&
                <div className={styles.menu}>
                    <ul>
                        <button onClick={() => {
                            navigation('/home');
                            setMenu(false);
                        }} className={styles.btn_menu}>
                            Home
                            <IoIosArrowForward />
                        </button>
                        <button onClick={handleSair} className={styles.btn_menu} style={{ borderTop: 0 }}>
                            Sair
                            <IoIosArrowForward />
                        </button>
                    </ul>
                    <div onClick={() => setMenu(false)} className={styles.fundo} >
                        <span>Clique Para Fechar</span>
                    </div>
                </div>}
        </div>
    )
}
export default Header;