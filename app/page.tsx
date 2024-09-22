import HomeBlock from "./home";
import { fetchAyaInfo } from "@/types/ayaInfo";
import { fetchUdonFiles, fetchUdonInfo } from "@/types/udonInfo";

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
