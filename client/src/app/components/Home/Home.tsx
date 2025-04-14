"use client";
import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { UserProfile, UiState } from "../../../types"
import {DiaryApi} from "@/api";
import EntryForm from "../EntryForm/EntryForm"


type Props = {
  title?: string;
};

export default function Leaderboard({ title }: Props) {
  const [uiState, setUiState] = useState<UiState>("initial");
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchMyProfile() {
        setUiState("loading");
        const api = new DiaryApi();
        const profileResponse = await api.getMyProfile();

        if(!profileResponse) {
            setUiState("guest")
            setProfile(null);
        } else {
            setUiState("data")
            setProfile(profileResponse);
        }
    }

    fetchMyProfile();
  }, []);

  return (
    <div>
      <h2>{title}</h2>
  
      {uiState === "loading" && <p>Sæki notanda...</p>}
  
      {uiState === "guest" && (
        <>
            <h1>Velkominn á Dagurinn dagbók.</h1>
            <p>Þú ert ekki skráður inn.</p>
            <a className={styles.link} href="/signin">Vinsamlegast Skráðu þig inn</a> eða{" "}
            <a className={styles.link} href="/signup">stofnaðu aðgang</a>.
        </>
      )}
  
      {uiState === "data" && profile && (
        <div>
          <h1>Góðan Daginn, <strong>{profile.username}</strong></h1>
          <h2>Má bjóða þér að skrifa í dagbókina þína fyrir daginn í dag?</h2>
          <EntryForm />
        </div>
        
      )}
    </div>
  );
  
}
