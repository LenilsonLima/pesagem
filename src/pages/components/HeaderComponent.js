import styles from './HeaderComponent.module.scss';
import favo from '../assets/favo.png';

const HeaderComponent = ({ funcao, icone }) => {
    return (
        <div className={styles.areaHeader}>
            <div className={styles.container_header}>
                <div className={styles.area_left}>
                    <div className={styles.area_logo}>
                        <img src={favo} />
                    </div>
                    <div className={styles.area_left_textos}>
                        <span>PesaBox</span>
                        <span>Lenilson Lima Pantoja</span>
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