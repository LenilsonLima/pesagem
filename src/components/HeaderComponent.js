import styles from './HeaderComponent.module.scss';
import favo from '../assets/favo.png';
import { useEffect, useState } from 'react';

const HeaderComponent = ({ funcao, icone }) => {
    const [nome, setNome] = useState("");

    useEffect(() => {
        const carregarNome = async () => {
            const nomeArmazenado = localStorage.getItem("@pesa_box_nome");
            if (nomeArmazenado) {
                setNome(nomeArmazenado);
            }
        };

        carregarNome();
    }, []);
    return (
        <div className={styles.areaHeader}>
            <div className={styles.container_header}>
                <div className={styles.area_left}>
                    <div className={styles.area_logo}>
                        <img src={favo} />
                    </div>
                    <div className={styles.area_left_textos}>
                        <span>PesaBox</span>
                        {nome && <span>{nome}</span>}
                        <span>Versão: 1.0.0</span>
                    </div>
                </div>
                <button onClick={funcao}>
                    {icone}
                </button>
            </div>
        </div>
    )
}
export default HeaderComponent;