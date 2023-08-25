// ./app/page.tsx
import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
    <img src="/images/toly001.jpg" alt="Description" className="max-w-full w-1/2 h-auto mx-auto mb-4" />
    <h1 className="text-3xl md:text-4xl mb-4">
        ▲ Hey Toly 🦜🔗
      </h1>
      <ul>
        <li className="text-l">
          🤝
          <span className="ml-2">
            Explore the Solana Ecosystem using {" "}
            <a href="https://js.langchain.com/" target="_blank">
              LangChain.js
            </a>{" "}
            and the Vercel{" "}
            <a href="https://sdk.vercel.ai/docs" target="_blank">
              AI SDK
            </a>{" "}
            in a{" "}
            <a href="https://nextjs.org/" target="_blank">
              Next.js
            </a>{" "}
            project.
          </span>
        </li>
        <li className="text-l">
          👇
          <span className="ml-2">
            If you want to support our project <a href="https://x.com/hey_toly"><code>follow us on X</code></a>!
          </span>
        </li>
      </ul>
    </div>
  );
  return (
    <div className="max-w-s mx-auto">
      <ChatWindow
        endpoint="api/chat"
        emoji="🏴‍☠️"
        titleText="Hey Toly"
        placeholder="Fuck around and find out!"
        emptyStateComponent={InfoCard}
      ></ChatWindow>
    </div>
  );
}
