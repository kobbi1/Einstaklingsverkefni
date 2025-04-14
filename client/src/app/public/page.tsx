import Navigation from "@/app/components/Navigation/Navigation";
import styles from "./page.module.css";
import PublicEntries from "../components/PublicEntries/PublicEntries"

export default async function PublicPage(){
    return (
        <div className={styles.page}>
            <Navigation />
            <PublicEntries />
        </div>
    );
}
