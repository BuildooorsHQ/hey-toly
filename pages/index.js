import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import React, { useLayoutEffect } from 'react';
import { FaTwitter, FaGithub, FaGlobe } from 'react-icons/fa';
//import ReactGA from 'react-ga';

// Google Analytics
//ReactGA.initialize(TRACKING_ID);*/

const TRACKING_ID = 'G-TB36V4C169';

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
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);
  const [resultStyle, setResultStyle] = useState(styles.resulthide);
  const [buttonStyle, setButtonStyle] = useState(styles.buttonhide);

  // const MyApp = ({ Component, pageProps }) => {
  //   return (
  //     <>
  //       <Head>
  //         <script async src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}></script>
  //         <script dangerouslySetInnerHTML={{ __html: GA_TRACKING_CODE }} />
  //       </Head>
  //       <Component {...pageProps} />
  //     </>
  //   )
  // }

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.backgroundColor = "black";
    }
  }, []);

  function ShareOnTwitterButton({ text }) {
    let url = '';
    if (typeof window !== 'undefined') {
      url = 'https://heytoly.com';
    }
    const message = encodeURIComponent(text);
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${message}`;

    function handleClick() {
      window.open(shareUrl, '_blank');
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true); // Set loading state to true when form is submitted
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
      setButtonStyle(styles.buttonshare);

    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false); // Set loading state back to false after response is received
    }
  }

  return (
    <div>
      <Head>
        <title>Hey Toly</title>
        <link rel="icon" href="/toly001.jpg" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${TRACKING_ID}`}></script>
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
         <button className={styles.buttonclear} type="button" onClick={() => {
          setTolyInput("");
          setResultStyle(styles.resulthide);
          setButtonStyle(styles.buttonhide);
         }}>Clear</button>
         {loading ? (
          <div className={styles.loader}>Loading...</div>
        ) : (
        <input type="submit" value="Respond in 400ms..." />
        )}
        </form>
       <div className={resultStyle}>{result}</div>
       <button className={buttonStyle} type="clear" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent('https://heytoly.com')}&text=${encodeURIComponent(`@hey_toly 🤖\n\nQuestion: ${tolyInput} \n\n${result}\n\n 🔥 #HeyToly #ChatGPT #AI @buildooors_com #OPOS `)}`, '_blank', 'noopener noreferrer')}>Share on <FaTwitter /></button>
      </main>
      <footer>
        <div className={styles.footer}>
          <p><a className={styles.footerIcons} href="https://twitter.com/hey_toly"><FaTwitter /></a>  <a className={styles.footerIcons} href="https://github.com/johnforfar/hey-toly"><FaGithub /></a>  <a className={styles.footerIcons} href="https://buildooors.com"><FaGlobe /></a></p>
          <p>* ChatGPT may produce inaccurate information about people, places, or facts.</p>
          <p>Made with 💜, React & ChatGPT 3.5 Model text-davinci-003 tuned by <a href="https://github.com/johnforfar/hey-toly">John Forfar</a>.</p>
        </div>
      </footer>
    </div>
  );
}