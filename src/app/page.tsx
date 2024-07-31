// Cloudflare Pages
import React from "react";
import { CAT_FAVOURITES, Category, fetchAyaVideoIndex, VideoIndex } from '@/types/video';
import VideoPage from '../components/video-page';

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false

async function fetchIndex(): Promise<VideoIndex> {
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
  return <VideoPage initialCategories={joined}/>;
};

export default Home;
