import React, { useState, useEffect, Fragment } from "react";
import { FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import Head from "next/head";
import styles from "./index.module.css";

// Google Analytics
const TRACKING_ID = process.env.GA_KEY;
const GA_TRACKING_CODE = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${TRACKING_ID}', {
    page_path: window.location.pathname,
  });
`;

export default function Home() {
  const [tolyInput, setTolyInput] = useState("");
  const [result, setResult] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [resultStyle, setResultStyle] = useState(styles.resulthide);
  const [buttonStyle, setButtonStyle] = useState(styles.buttonhide);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.background =
        "linear-gradient(to right, #0f0c29, #302b63, #24243e)"; // CSS gradient dot io
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
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
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(`Answer: ${data.result}`);
      setResultStyle(styles.result);
      setButtonStyle(styles.buttonshare);
    } catch (error: any) {
      console.error(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <div className="heyTolyBg">
        <Head>
          <title>Hey Toly</title>
          <link rel="icon" href="/toly001.jpg" />
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}
          ></script>
          <script dangerouslySetInnerHTML={{ __html: GA_TRACKING_CODE }} />
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
            <button
              className={styles.buttonclear}
              type="button"
              onClick={() => {
                setTolyInput("");
                setResultStyle(styles.resulthide);
                setButtonStyle(styles.buttonhide);
              }}
            >
              Clear
            </button>
            {loading ? (
              <div className={styles.loader}>Loading...</div>
            ) : (
              <input type="submit" value="Respond in 400ms..." />
            )}
          </form>
          <div className={resultStyle}>{result}</div>
          <button
            className={buttonStyle}
            type="button"
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  "https://heytoly.com"
                )}&text=${encodeURIComponent(
                  `@hey_toly 🤖\n\nQuestion: ${tolyInput} \n\n${result}\n\n 🔥 #HeyToly #ChatGPT #AI @buildooors_com #OPOS`
                )}`,
                "_blank",
                "noopener noreferrer"
              )
            }
          >
            Share on <FaTwitter />
          </button>
        </main>
        <footer>
          <div className={styles.footer}>
            <p>
              <a
                className={styles.footerIcons}
                href="https://twitter.com/hey_toly"
              >
                <FaTwitter />
              </a>{" "}
              <a
                className={styles.footerIcons}
                href="https://github.com/johnforfar/hey-toly"
              >
                <FaGithub />
              </a>{" "}
              <a className={styles.footerIcons} href="https://buildooors.com">
                <FaGlobe />
              </a>
            </p>
            <p>
              * ChatGPT may produce inaccurate information about people, places,
              or facts.
            </p>
            <p>
              Made with 💜, React & ChatGPT 3.5 Model text-davinci-003 tuned by{" "}
              <a href="https://github.com/johnforfar/hey-toly">John Forfar</a>.
            </p>
          </div>
        </footer>
      </div>
    </Fragment>
  );
}
