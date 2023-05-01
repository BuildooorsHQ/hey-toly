import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React, { useLayoutEffect } from 'react';
// import {FiTwitter} from 'react-icons/fa';
import { FaTiktok, FaTwitter} from 'react-icons/fa';

export default function Home() {
  const [tolyInput, setTolyInput] = useState("");
  const [result, setResult] = useState();
  const [resultStyle, setResultStyle] = useState(styles.resultHide);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.backgroundColor = "black";
    }
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ toly: tolyInput,  }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult("Answer: " + data.result);
      setResultStyle(styles.result);
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
            placeholder="Ask me a question about Solana..."
            value={tolyInput}
            onChange={(e) => setTolyInput(e.target.value)}
          />
          <input type="submit" value="Respond in 400ms..." />
        </form>
       <div className={resultStyle}>{result}</div>
      </main>
      <footer>
        <div className={styles.footer}>
          <p><a href="https://twitter.com/hey_toly"><FaTwitter /></a></p>
          <p>* ChatGPT may produce inaccurate information about people, places, or facts.</p>
          <p>Made with 💜, React & ChatGPT 3.5 Model text-davinci-003 by <a href="https://github.com/johnforfar/hey-toly">John Forfar</a>.</p>
        </div>
      </footer>
    </div>
  );
}
