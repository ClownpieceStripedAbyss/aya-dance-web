import HomeBlock from "./home";
import { fetchAyaInfo } from "@/types/ayaInfo";
import { fetchUdonFiles, fetchUdonInfo } from "@/types/udonInfo";

// Cloudflare needs it, see: https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;

export default async function Home() {
  const fallbackAya = await fetchAyaInfo();
  const fallbackUdon = await fetchUdonInfo();
  const fallbackUdonFiles = await fetchUdonFiles();

  return (
    <HomeBlock
      fallbackAyaInfo={fallbackAya}
      fallbackUdonFiles={fallbackUdonFiles}
      fallbackUdonInfo={fallbackUdon}
    />
  );
}
