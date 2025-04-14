import Navigation from "@/app/components/Navigation/Navigation";
import styles from "./page.module.css";
import Signin from '../components/Signin/Signin'

export default async function SigninPage(){
    return (
        <div className={styles.page}>
            <Navigation />
            <h1 className={styles.header}>Innskráning</h1>
            <Signin />
        </div>
    );
}
