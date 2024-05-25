import React, { useEffect, useState } from 'react';
import { KEY_FAVOURITES, Video, videoThumbnailUrl, videoUrl } from '@/types/video';
import Image from 'next/image';
import ReceiptDialog from "@/components/receipt-dialog";

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isThumbnailError, setIsThumbnailError] = useState(false);

  useEffect(() => {
    const savedFavourites = localStorage.getItem(KEY_FAVOURITES);
    if (savedFavourites) {
      const favourites = JSON.parse(savedFavourites) as Video[];
      setIsLiked(favourites.some((v: Video) => v.id === video.id));
    }
  }, [video]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    const savedData = localStorage.getItem(KEY_FAVOURITES);
    const favourites = savedData ? JSON.parse(savedData) : [];
    if (isLiked) {
      localStorage.setItem(KEY_FAVOURITES, JSON.stringify(favourites.filter((v: Video) => v.id !== video.id)));
    } else {
      localStorage.setItem(KEY_FAVOURITES, JSON.stringify([...favourites, video]));
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div
      className="flex items-center justify-between p-4 mb-4 rounded-lg bg-white dark:bg-neutral-800">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-32 h-24 mr-4 flex items-center justify-center">
          <Image
            src={isThumbnailError ? "/unity-error.jpg" : videoThumbnailUrl(video)}
            alt={video.title}
            onError={(_) => setIsThumbnailError(true)}
            width={128}
            height={96}
            className="object-cover outline-link dark:outline-link outline-offset-2 aspect-video w-full h-full select-none flex-col shadow-inner-border rounded-lg flex items-center overflow-hidden justify-center align-middle text-white/50 bg-cover bg-white bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] hover:opacity-60 transition-opacity"
          />
        </div>
        <div className="flex-grow">
          <h2
            className="text-base font-bold mb-1 outline-link dark:outline-link outline-offset-4 group flex flex-col flex-1 gap-0.5">
            <a href={videoUrl(video)} target="_blank" className="group-hover:underline">{video.title}</a>
          </h2>
          <p className="text-sm text-gray-500 text-tertiary leading-snug">ID: {video.id}</p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2 flex-shrink-0">
        <button
          onClick={() => window.open(`https://aya-dance-cf.kiva.moe/api/v1/videos/${video.id}.mp4`, '_blank')}
          className="outline-none focus:bg-red-50/5 focus:text-red-50 relative flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-card active:scale-95 active:bg-red-50/5 active:text-red-50 text-tertiary">
          <Image
            src="/play.svg"
            alt="Play"
            width={24}
            height={24}
          />
        </button>
        <button
          onClick={handleLike}
          className="outline-none focus:bg-red-50/5 focus:text-red-50 relative flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-card active:scale-95 active:bg-red-50/5 active:text-red-50 text-tertiary}">
          <Image
            src={isLiked ? '/heart-filled.svg' : '/heart.svg'}
            alt="Favorite"
            width={24}
            height={24}
          />
        </button>
        <button
          onClick={handleOpenModal}
          className="outline-none focus:bg-red-50/5 focus:text-red-50 relative flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-card active:scale-95 active:bg-red-50/5 active:text-red-50 text-tertiary">
          <Image
            src="/list.svg"
            alt="Add to Remote Receipt"
            width={24}
            height={24}
          />
        </button>
      </div>
      {isModalOpen && (
        <ReceiptDialog video={video} setIsModalOpen={setIsModalOpen}/>
      )}
    </div>
  );
};

export default VideoItem;
