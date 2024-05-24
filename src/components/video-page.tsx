'use client';

import { useEffect, useRef, useState } from 'react';
import CategoryList from './category-list';
import VideoList from './video-list';
import { Video } from '@/types/video';

interface VideoPageProps {
  initialVideos: Video[];
}

interface CategoryScrollPositions {
  [category: string]: number;
}

const VideoPage: React.FC<VideoPageProps> = ({ initialVideos }) => {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>(initialVideos);
  const [categoryScrollPositions, setCategoryScrollPositions] = useState<CategoryScrollPositions>({});
  const videoListRef = useRef<HTMLDivElement>(null);

  const ALL_CAT = 'All';

  useEffect(() => {
    const filtered = videos.filter(video => {
      return (
        (selectedCategory && selectedCategory !== ALL_CAT ? video.categoryName === selectedCategory : true) &&
        (video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          video.titleSpell.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    setFilteredVideos(filtered);
  }, [selectedCategory, searchTerm, videos]);

  const categories = Array.from(new Set(
    [ALL_CAT].concat(
      videos.map(video => video.categoryName),
    )));

  const handleClearSearch = () => {
    setSearchTerm('');
    if (videoListRef && videoListRef.current) {
      videoListRef.current.scrollTo(0, 0);
    }
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    // Scroll the video list to the previous position for this category
    if (videoListRef && videoListRef.current) {
      let pos = categoryScrollPositions[category] ? categoryScrollPositions[category] : 0;
      videoListRef.current.scrollTo(0, pos);
    }
  };

  const handleScroll = () => {
    // Update the scroll position for the current category
    if (selectedCategory && videoListRef.current) {
      const currentScrollPosition = videoListRef.current.scrollTop;
      setCategoryScrollPositions(prevPositions => ({
        ...prevPositions,
        [selectedCategory]: currentScrollPosition,
      }));
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 w-full max-w-7xl flex-1 flex flex-row justify-between font-mono text-sm lg:flex">
        <div className="fixed w-1/4 inset-y-12 left-20 overflow-y-auto">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
        <div className="fixed w-3/4 flex-1 flex flex-col pb-36 px-4 h-full">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded"
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                &times;
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto" ref={videoListRef} onScroll={handleScroll}>
            <VideoList videos={filteredVideos}/>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoPage;
