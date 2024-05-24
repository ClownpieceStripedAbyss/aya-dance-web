import React, { useEffect, useState } from 'react';
import { Video } from '@/types/video';
import Image from 'next/image';

interface VideoItemProps {
  video: Video;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomUrl: 'https://aya-dance-cf.kiva.moe/r/ad-',
    targetUser: '',
    senderName: '',
    message: '',
    whisper: '',
  });
  const [notification, setNotification] = useState<{ message: string; success: boolean } | null>(null);

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
        roomUrl: 'https://aya-dance-cf.kiva.moe/r/ad-',
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
      [e.target.name]: e.target.value,
    };
    setFormData(newFormData);
    localStorage.setItem('requestFormData', JSON.stringify(newFormData));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(formData.roomUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
        body: JSON.stringify({
          target: formData.targetUser,
          sender: formData.senderName,
          id: video.id,
          message: formData.message,
          whisper: formData.whisper,
        }),
      });
      const result: { message: string } = await response.json();
      if (result.message === 'ok') {
        setNotification({ message: '点歌成功，待好友确认后就会加入队列中啦', success: true });
      } else {
        setNotification({ message: result.message, success: false });
      }
    } catch (error: any) {
      setNotification({ message: error.toString(), success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = !formData.roomUrl || !formData.targetUser;

  return (
    <div
      className="flex items-center justify-between p-4 mb-4 rounded-lg border-b border-gray-300 bg-white dark:bg-neutral-800">
      <div className="flex items-center">
        <div className="w-32 mr-4 flex items-center justify-center">
          <Image
            src={video.thumbnailUrl || '/unity-error.jpg'}
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
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">为好友点歌！</h3>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src={video.thumbnailUrl || '/unity-error.jpg'}
                  alt={video.title}
                  width={64}
                  height={48}
                  className="object-cover rounded mr-4"
                />
                <div>
                  <h4 className="font-bold">{video.title}</h4>
                  <p className="text-sm text-gray-500">ID: {video.id}</p>
                </div>
              </div>
              <a href={`https://aya-dance-cf.kiva.moe/api/v1/videos/${video.id}.mp4`} target="_blank"
                 className="text-blue-500 hover:underline">预览视频</a>
            </div>
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
              <div className="mb-4 flex items-center space-x-4">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-2">点歌人（可选）</label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="text-center">
                  <label className="block text-gray-700 mb-2">&nbsp;</label>
                  <span className="block text-gray-700">→</span>
                </div>
                <div className="w-1/2">
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
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">公开附言（可选）</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                ></textarea>
                <p className="text-xs text-gray-500">公开附言会公开展示给房间内所有人</p>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">私密附言（可选）</label>
                <textarea
                  name="whisper"
                  value={formData.whisper}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                ></textarea>
                <p className="text-xs text-gray-500">这是悄悄话哦~</p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white p-2 rounded mr-2 hover:bg-gray-700 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition ${isSubmitDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitDisabled}
                >
                  {isSubmitting ? (
                    <Image
                      src="./sync.svg"
                      alt="Sending"
                      width={12}
                      height={12}
                      className="animate-spin ml-5 mr-5 h-5 w-8 text-white fill-white"
                    />
                  ) : (
                    '提交点歌请求'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {notification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">{notification.success ? '好耶！' : '坏耶...'}</h3>
            <p>{notification.message}</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setNotification(null)
                  if (notification?.success)
                    handleCloseModal();
                }}
                className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-700 transition"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoItem;
