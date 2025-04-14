'use client'

import { useState } from "react";
import styles from "./Signin.module.css"
import {DiaryApi} from "@/api";
import { useRouter } from "next/navigation";

export default function Signup() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
    
        const api = new DiaryApi();
        const success = await api.postSignin(username, password);
    
        if (success) {
          router.push("/");
        } else {
          setMessage("Innskráning tókst ekki, athugaðu hvort notendanafn eða lykilorð sé rétt.");
        }
      }
    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label} htmlFor="username">Notendanafn:</label>
                <input
                    className={styles.input}
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label className={styles.label} htmlFor="password">Lykilorð:</label>
                <input
                    className={styles.input}
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className={styles.button} type="submit">
                    Skrá mig inn
                </button>
                <p>Ekki með aðgang? <a href="/signup">búa til nyjan aðgang</a></p>
                {message && <p>{message}</p>}
            </form>
            </div>
      );
}