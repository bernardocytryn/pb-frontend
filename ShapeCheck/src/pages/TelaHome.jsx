import styles from './TelaHome.module.css';
import OlaMensagem from '../features/home/OlaMensagem';
import TreinoDoDia from '../features/home/TreinoDoDia';
import CalendarioSemanal from '../features/home/CalendarioSemanal';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <OlaMensagem />
        <TreinoDoDia />
        <CalendarioSemanal />

      </main>
    </div>
  );
}
