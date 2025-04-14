"use client"

import Link from "next/link";
import styles from "./Navigation.module.css"
import { useEffect, useState } from "react";
import { DiaryApi } from "@/api";
import { UserProfile } from "@/types";

export default function Navigation() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const api = new DiaryApi();
      const profile = await api.getMyProfile();
      setUser(profile);
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    
    const api = new DiaryApi();
    const success = await api.postSignout();

    if (success) {
      setUser(null);
      window.location.reload();
      window.location.href = "/"
    }
  }

  return (
    <nav className={styles.nav}>
    <ul>
        <li><Link href="/">Heimasíða</Link></li>
        <li><Link href="/leaderboard">Stigatafla</Link></li>
        {user && <li><Link href="/me">Mín Dagbók</Link></li>}
        <li><Link href="/public">Deildar færslur</Link></li>
        {user && (
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Útskráning
            </button>
          </li>
        )}
    </ul>
    </nav>
  );
}

