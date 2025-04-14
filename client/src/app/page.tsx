import styles from "./page.module.css";
import Navigation from "./components/Navigation/Navigation"
import TheHome from "./components/Home/Home"

export default function Home() {
  return (
    <div  className={styles.page}>
      <Navigation />
      <div className={styles.mainContent}>
      <TheHome />
      </div>
    </div>
  );
}
