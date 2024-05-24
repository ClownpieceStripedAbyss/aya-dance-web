import React from "react";
import { Video, VideoIndex } from '@/types/video';
import VideoPage from '../components/video-page';

async function fetchVideos(): Promise<Video[]> {
  const response = await fetch('https://aya-dance-cf.kiva.moe/aya-api/v1/songs', {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch videos');
  }

  const data = await response.json() as VideoIndex; // 解析为 VideoIndex 类型
  const videos: Video[] = [];

  var category = data.categories[0];
  category.entries.forEach((video) => {
    videos.push({
      id: video.id,
      title: video.title,
      category: video.category,
      categoryName: video.categoryName,
      titleSpell: video.titleSpell,
      volume: video.volume,
      start: video.start,
      end: video.end,
      flip: video.flip,
      thumbnailUrl: '/test.webp',
    });
  });

  return videos;
}

async function fetchVideosTest(): Promise<Video[]> {
  return [...Array(500)].map((_, i) => ({
    id: i,
    title: 'Video ' + i,
    category: 1,
    categoryName: 'Category ' + (i % 10),
    titleSpell: 'video1',
    volume: 1,
    start: 0,
    end: 10,
    flip: false,
    thumbnailUrl: '/test.webp',
  }));
}

const Home: React.FC = async () => {
  const videos = await fetchVideos();
  return <VideoPage initialVideos={videos}/>;
};

export default Home;
