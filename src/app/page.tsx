import React from "react";
import { VideoIndex } from '@/types/video';
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
  return <VideoPage initialCategories={index.categories}/>;
};

export default Home;
