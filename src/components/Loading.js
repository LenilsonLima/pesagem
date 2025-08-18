import styles from './Loading.module.scss';
const Loading = () => {
    return (
        <div className={styles.container_loading}>
            <div className={styles.loading}></div>
        </div>
    )
}
export default Loading;