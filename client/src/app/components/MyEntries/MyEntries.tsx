"use client";

import { useEffect, useState } from "react";
import { DiaryApi } from "@/api";
import { Entry, UiState } from "@/types";
import styles from "./MyEntries.module.css"

export default function MyEntries() {
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [uiState, setUiState] = useState<UiState>("initial");

  useEffect(() => {
    async function fetchEntries() {
      setUiState("loading");
      const api = new DiaryApi();
      const result = await api.getMyEntries();

      if (!result) {
        setUiState("error");
      } else {
        setUiState("data");
        setEntries(result);
      }
    }

    fetchEntries();
  }, []);

  if (uiState === "loading") return <p>Sæki færslur...</p>;
  if (uiState === "error") return <p>Villa við að sækja færslur</p>;

  return (
    <div className={styles.main}>
      <h1 className={styles.pageTitle}>Færslurnar mínar</h1>
      {entries?.length === 0 && <p>Engar færslur til að sýna ennþá.</p>}
      <ul className={styles.ul}>
        {entries?.map((entry) => (
          <li className={styles.content} key={entry.id}>
            <h3 className={styles.entryTitle}>{entry.title}</h3>
            <p>{entry.content.slice(0, 200)}...</p>
            <small>{new Date(entry.created_at).toLocaleDateString()}</small>
            <br />
            <strong>{entry.is_public ? "Opinbert" : "Falið"}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
