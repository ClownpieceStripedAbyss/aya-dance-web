import HomeBlock from "./home";

// Cloudflare needs it, see: https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;

export default function Home() {
  return <HomeBlock />;
}
