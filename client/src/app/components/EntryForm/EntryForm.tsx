"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DiaryApi } from "@/api";
import styles from "./EntryForm.module.css";

export default function NewEntryForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const api = new DiaryApi();
    const success = await api.postEntry(title, content, isPublic);

    if (success) {
      setMessage("Færsla búin til!");
      setTitle("");
      setContent("");
      setIsPublic(false);
      router.push("/me");
    } else {
      setMessage("Tókst ekki að búa til færslu.");
    }
  }

  return (
  <form onSubmit={handleSubmit} className={styles.form}>
    <div className={styles.formGroup}>
      <label className={styles.label}>Titill:</label>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>

    <div className={styles.formGroup}>
      <label className={styles.label}>Innihald:</label>
      <textarea
        className={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
    </div>

    <div className={styles.checkboxGroup}>
      <input
        type="checkbox"
        checked={isPublic}
        onChange={(e) => setIsPublic(e.target.checked)}
      />
      <label>Deila opinberlega</label>
    </div>

    <button className={styles.button} type="submit">
      Búa til færslu
    </button>

    {message && <p className={styles.message}>{message}</p>}
  </form>

  );
}
