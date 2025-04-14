"use client";
import { useEffect, useState } from "react";
import styles from "./Leaderboard.module.css";
import { TheLeaderboard, UiState } from "../../../types"
import {DiaryApi} from "@/api";


type Props = {
  title?: string;
};

export default function Leaderboard({ title }: Props) {
  const [uiState, setUiState] = useState<UiState>("initial");
  const [users, setTheLeaderboard] = useState<TheLeaderboard[]>([]);

  useEffect(() => {
    async function fetchLeaderboard() {
        setUiState("loading");
        const api = new DiaryApi();
        const leaderboardResponse = await api.getLeaderboard();

        if(!leaderboardResponse) {
            setUiState("error")
        } else {
            setUiState("data")
            setTheLeaderboard(leaderboardResponse);
        }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className={styles.board}>
      <h2>{title}</h2>

      {uiState === "loading" && <p>Sæki stigatöflu...</p>}

      {uiState === "error" && <p>Villa við að sækja stigatöflu</p>}

      {uiState === "data" && (
        <ol className={styles.list}>
          {users.map((user) => (
            <li key={user.id} className={styles.user}>
              <span>{user.username} </span>
              <span>{user.points} stig</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
