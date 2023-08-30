// ./app/page.tsx
import { ChatWindow } from "@/components/ChatWindow";
import ParticlesComponent from "@/components/ParticlesComponent";
import Image from "next/image";

export default function Home() {

  const InfoCard = (
    <div className="p-4 md:p-8  w-full max-h-[85%] overflow-hidden">
    </div>
  );
  return (
 <div style={{ position: 'relative', height: '100vh' }}>
<ParticlesComponent />
    <div className="fixed bottom-0 max-w-s mx-auto">
<div className="fixed top-0 text-3xl font-bold p-2 text-center ">Hey Toly...</div>
<Image src="/images/toly.png" alt="Hey Toly" width={200} height={200} className="rounded-full mx-auto" />
      <ChatWindow
        endpoint="api/chat"
        emoji="🤖"
        titleText="Hey Toly"
        placeholder="Fuck around and find out!"
        emptyStateComponent={InfoCard}
      ></ChatWindow>
<div className="text-sm text-center p-2">Copyright ©️ 2023 | heytoly.com | <a href="https://buildooors.com" target="_blank">Buildooors.com</a></div>
    </div>
    </div>
  );
}
