// Cloudflare Pages
export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false

import React from "react";
import { CAT_FAVOURITES, Category, VideoIndex } from '@/types/video';
import VideoPage from '../components/video-page';

async function fetchIndex(): Promise<VideoIndex> {
  const response = await fetch('https://aya-dance-cf.kiva.moe/aya-api/v1/songs', {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  return await response.json() as VideoIndex;
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
