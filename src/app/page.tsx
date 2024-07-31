// Cloudflare Pages
import React from "react";
import { CAT_FAVOURITES, Category, fetchAyaVideoIndex, VideoIndex } from '@/types/video';
import VideoPage from '../components/video-page';
import { fetchUdonVideoIndex } from "@/types/udon-dance";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false

async function fetchIndex(): Promise<VideoIndex> {
  if (process.env.USE_UDON_DANCE) {
    return await fetchUdonVideoIndex();
  }
  return await fetchAyaVideoIndex();
}

const Home: React.FC = async () => {
  const index = await fetchIndex();
  const cats = index.categories;
  const favCat: Category = {
    title: CAT_FAVOURITES,
    entries: [],
  };
  const joined = [favCat, ...cats]
  return <VideoPage initialCategories={joined} defaultSortBy={index.defaultSortBy}/>;
};

export default Home;
