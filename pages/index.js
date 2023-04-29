import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [tolyInput, setTolyInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toly: tolyInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult("Superhero Names: " + data.result);
      setTolyInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Hey Toly</title>
        <link rel="icon" href="/toly001.jpg" />
      </Head>

      <main className={styles.main}>
        <img src="/toly001.jpg" className={styles.icon} />
        <h3>Hey Toly...</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Enter your favourite blockchain..."
            value={tolyInput}
            onChange={(e) => setTolyInput(e.target.value)}
          />
          <input type="submit" value="Respond in 400ms..." />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
