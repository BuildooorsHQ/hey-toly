// ./pages/index.tsx
import React, { useState, useEffect, Fragment } from "react";
import { FaTwitter, FaGithub, FaGlobe } from "react-icons/fa";
import Head from "next/head";
import Link from "next/link";
import styles from "./input.module.css";
import { processInput } from "../utils/inputProcessor.ts";
import { performOutputAction } from "../utils/outputAction.ts";

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
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [resultStyle, setResultStyle] = useState(styles.resulthide);
  const [buttonStyle, setButtonStyle] = useState(styles.buttonhide);

  useEffect(() => {
    const performSearch = async () => {
      try {
        const res = await fetch('/api/searchProject', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: 'MetaVersana' }),
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const result = await res.json();

        console.log(result);
      } catch (error) {
        console.error("Search error: ", error);
      }
    };

    performSearch();
  }, []);

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
      const generatedResponse = await processInput(tolyInput);
      console.log("Generated response: ", generatedResponse); // Log the response

      const handleOutputAction = performOutputAction(
        generatedResponse,
        setResult,
        setResultStyle,
        setButtonStyle
      );

      handleOutputAction(tolyInput); // Pass tolyInput as a parameter
      console.log("New result state after onSubmit: ", result);
    } catch (error) {
      console.log("Index error: ", error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const renderResponse = () => {
    console.log("Rendering result: ", result);
    if (result) {
      return (
        <div className={resultStyle}>
          <h4>Result:</h4>
          <p>{result}</p>
        </div>
      );
    }
    return null;
  };

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
          <Link href="/scraper/status">
            <a>Scraper Status</a>
          </Link>
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
                setResult("");
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
          {renderResponse()}
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
              <a className={styles.footerIcons} href="https://twitter.com/hey_toly">
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
            <p>* ChatGPT may produce inaccurate information about people, places,</p>
            <p>or facts.</p>
            <p>
              Made with 💜, Next, React, Langchain & ChatGPT gpt-3.5-turbo tuned by{" "}
              <a href="https://github.com/johnforfar/hey-toly">John Forfar</a>.
            </p>
          </div>
        </footer>
      </div>
    </Fragment>
  );
}
