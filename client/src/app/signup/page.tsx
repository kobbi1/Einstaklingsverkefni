import Navigation from "@/app/components/Navigation/Navigation";
import Signup from "@/app/components/Signup/Signup";
import styles from "./page.module.css";

export default async function SignupPage(){
    return (
        <div className={styles.page}>
            <Navigation />
            <h1 className={styles.header}>Nýskráning</h1>
            <Signup />
        </div>
    );
}