import React, { useEffect, useState } from 'react';
import { Video } from '@/types/video';
import Image from 'next/image';

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomUrl: 'https://aya-dance-cf.kiva.moe/r/ad-',
    targetUser: '',
    singerName: '',
    message: '',
    privateMessage: ''
  });

  useEffect(() => {
    const savedData = localStorage.getItem('requestFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleOpenModal = () => {
    const savedData = localStorage.getItem('requestFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      setFormData({
        ...formData,
        roomUrl: 'https://aya-dance-cf.kiva.moe/r/ad-'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    localStorage.setItem('requestFormData', JSON.stringify(newFormData));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle the submit logic here
    console.log('Form submitted:', formData);
    handleCloseModal();
  };

  const isSubmitDisabled = !formData.roomUrl || !formData.targetUser;

  return (
    <div
      className="flex items-center justify-between p-4 mb-4 rounded-lg border-b border-gray-300 bg-white dark:bg-neutral-800">
      <div className="flex items-center">
        <div className="w-32 mr-4 flex items-center justify-center">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            width={128}
            height={96}
            className="object-cover outline-link dark:outline-link outline-offset-2 aspect-video w-32 xs:w-36 select-none flex-col shadow-inner-border rounded-lg flex items-center overflow-hidden justify-center align-middle text-white/50 bg-cover bg-white bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] hover:opacity-95 transition-opacity"
          />
        </div>
        <div>
          <h2
            className="text-xl font-bold mb-1 outline-link dark:outline-link outline-offset-4 group flex flex-col flex-1 gap-0.5">{video.title}</h2>
          <p className="text-sm text-gray-500 text-tertiary leading-snug">Start: {video.start}, End: {video.end},
            Volume: {video.volume}</p>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
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
          className={`outline-none focus:bg-red-50/5 focus:text-red-50 relative flex items-center justify-center w-10 h-10 cursor-pointer rounded-full hover:bg-card active:scale-95 active:bg-red-50/5 active:text-red-50 ${isLiked ? 'text-red-500' : 'text-tertiary'}`}>
          <Image
            src="/fav.svg"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">为好友点歌！</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">房间 URL</label>
                <input
                  type="text"
                  name="roomUrl"
                  value={formData.roomUrl}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">想要为谁点歌？</label>
                <input
                  type="text"
                  name="targetUser"
                  value={formData.targetUser}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">歌曲 ID</label>
                <input
                  type="text"
                  name="songId"
                  value={video.id}
                  className="w-full p-2 border rounded"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">点歌人（可选）</label>
                <input
                  type="text"
                  name="singerName"
                  value={formData.singerName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">公开附言（可选）</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">私密附言（可选）</label>
                <textarea
                  name="privateMessage"
                  value={formData.privateMessage}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitDisabled}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoItem;
