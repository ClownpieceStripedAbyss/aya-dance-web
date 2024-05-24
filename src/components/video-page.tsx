'use client';

import React, { useEffect, useRef, useState } from 'react';
import CategoryList from './category-list';
import VideoList from './video-list';
import { Video } from '@/types/video';
import '@/styles/scrollbar.css';

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
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [inputPage, setInputPage] = useState<string | null>(null);

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

  useEffect(() => {
    setCurrentPage(1); // Reset to first page whenever filter changes
  }, [filteredVideos]);

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
    if (categoryScrollPositions[category] && videoListRef.current) {
      videoListRef.current.scrollTo(0, categoryScrollPositions[category]);
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

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const handleFirstPageClick = () => {
    setCurrentPage(1);
  };

  const handleLastPageClick = () => {
    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    setCurrentPage(totalPages);
  };

  const handlePageChange = () => {
    if (inputPage && inputPage.trim() !== '') {
      let page = parseInt(inputPage, 10);
      const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
      page = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(page);
      setInputPage(null);
    }
  };

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredVideos.length);
  const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 w-full max-w-7xl flex-1 flex flex-row justify-between font-mono text-sm lg:flex">
        <div className="fixed inset-y-12 left-20 overflow-y-auto scrollbar-custom">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
        <div className="fixed w-3/4 flex-1 flex flex-col pb-24 px-4 h-full ml-1/4">
          <div className="relative mb-4">
            <div
              className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
              <img src={"/search.svg"} className="text-gray-30 w-4"/>
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 flex ps-11 py-4 h-10 text-start bg-secondary-button outline-none betterhover:hover:bg-opacity-80 pointer items-center text-primary rounded-full align-middle text-base"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="w-4 absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
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
          <div className="flex-1 overflow-y-auto scrollbar-custom" ref={videoListRef} onScroll={handleScroll}>
            <VideoList videos={paginatedVideos} emptyHeading={`No matches for "${searchTerm}"`}/>
          </div>
          <div className="flex justify-end mt-4">
            <div>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="border px-2 py-1 mr-2"
              >
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
                <option value="300">300 per page</option>
              </select>
            </div>
            <div>
              <button onClick={handleFirstPageClick} disabled={currentPage === 1}
                      className="px-2 py-1 mr-2 border">⇤
              </button>
              <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
                      className="px-2 py-1 mr-2 border">←
              </button>
              <input
                type="text"
                value={inputPage != null ? inputPage : currentPage}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePageChange();
                  }
                }}
                className="border px-2 py-1 mr-2 w-12 text-center"
              />
              <span className="px-2 py-1 mr-2 w-12 text-base">/ {totalPages}</span>
              <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 py-1 mr-2 border">→
              </button>
              <button onClick={handleLastPageClick} disabled={currentPage === totalPages}
                      className="px-2 py-1 mr-2 border">⇥
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoPage;
