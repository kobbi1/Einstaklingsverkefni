import Navigation from "@/app/components/Navigation/Navigation";
import Leaderboard from "@/app/components/Leaderboard/Leaderboard"
import styles from "./page.module.css";


export default async function LeaderboardPage(){ 
    return (
        <div className={styles.page}>
            <Navigation />
            <Leaderboard title="Stigatafla" />
        </div>
    );
}
