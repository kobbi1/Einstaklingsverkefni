import Navigation from "@/app/components/Navigation/Navigation";
import styles from "./page.module.css";
import MyEntries from "../components/MyEntries/MyEntries"

export default async function MePage(){
    return (
        <div className={styles.page}>
            <Navigation />
            <MyEntries />
        </div>
    );
}
