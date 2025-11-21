import styles from './LoadingComponent.module.scss';

const LoadingComponent = () => {
    return (
        <div className={styles.loading}>
            <img src={require('../assets/loading.gif')} />
        </div>
    )
}
export default LoadingComponent;