"use client";

import { useEffect, useState } from "react";
import { DiaryApi } from "@/api";
import { PublicEntry, UiState, UserProfile } from "@/types";
import styles from "./PublicEntries.module.css"

export default function PublicEntries() {
  const [entries, setEntries] = useState<PublicEntry[] | null>(null);
  const [uiState, setUiState] = useState<UiState>("initial");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [givenPoints, setGivenPoints] = useState<number[]>([]);


  useEffect(() => {
    async function fetchData() {
      setUiState("loading");
      const api = new DiaryApi();

      const [profile, publicEntries, given] = await Promise.all([
        api.getMyProfile(),
        api.getPublicEntries(),
        api.getGivenPoints(),
      ]);

      setUser(profile);
      setGivenPoints(given ?? [])

      if (!publicEntries) {
        setUiState("error");
      } else {
        setEntries(publicEntries);
        setUiState("data");
      }
    }

    fetchData();
  }, []);

  async function handleGivePoint(entryId: number) {
    const api = new DiaryApi();
    const success = await api.givePoint(entryId);
    if (success) {
      setGivenPoints([...givenPoints, entryId]);
      const updated = await api.getPublicEntries();
      setEntries(updated);
    }
  }
  
  async function handleRemovePoint(entryId: number) {
    const api = new DiaryApi();
    const success = await api.removePoint(entryId);
    if (success) {
      setGivenPoints(givenPoints.filter((id) => id !== entryId));
      const updated = await api.getPublicEntries();
      setEntries(updated);
    }
  }
  

  if (uiState === "loading") return <p>Sæki færslur...</p>;
  if (uiState === "error") return <p>Villa við að sækja færslur.</p>;

  return (
    <div className={styles.main}>
      <h1 className={styles.pageTitle}>Deildar færslur</h1>
      <ul className={styles.ul}>
        {entries?.map((entry) => (
          <li className={styles.content} key={entry.id}>
            <h3 className={styles.entryTitle}>{entry.title}</h3>
            <p>{entry.content.slice(0, 200)}...</p>
            <small>Skráð af: {entry.username}</small><br />
            <small>{new Date(entry.created_at).toLocaleDateString("en-GB")}</small><br />
            <strong>{entry.total_points} stig</strong>

            {user && user.username !== entry.username && (
                givenPoints.includes(entry.id) ? (
                    <button className={styles.removePointButton} onClick={() => handleRemovePoint(entry.id)}>
                        Fjarlægja stig
                    </button>
                ) : (
                    <button className={styles.givePointButton} onClick={() => handleGivePoint(entry.id)}>
                    Gefa stig
                    </button>
                )
                )}
          </li>
        ))}
      </ul>
    </div>
  );
}
