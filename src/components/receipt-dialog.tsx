import Image from "next/image";
import { Video, videoThumbnailUrl, videoUrl } from "@/types/video";
import React, { useEffect, useState } from "react";
import InfoDialog from "@/components/info-dialog";

export interface ModelFormData {
  roomUrl: string;
  targetUser: string;
  senderName: string;
  message: string;
  whisper: string;
}

export interface ReceiptDialogProps {
  video: Video;
  setIsModalOpen: (isOpen: boolean) => void;
  initialFormData?: ModelFormData;
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({ video, setIsModalOpen, initialFormData }) => {
  const [isThumbnailError, setIsThumbnailError] = useState(false);
  const [notification, setNotification] = useState<{ message: string; success: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialFormData || {
    roomUrl: 'https://aya-dance-cf.kiva.moe/r/ad-',
    targetUser: '',
    senderName: '',
    message: '',
    whisper: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('requestFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

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
      className="z-20 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto scrollbar-custom">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-4">为好友点歌！</h3>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src={isThumbnailError ? "/unity-error.jpg" : videoThumbnailUrl(video)}
              alt={video.title}
              onError={(_) => setIsThumbnailError(true)}
              width={64}
              height={48}
              className="object-cover rounded mr-4"
            />
            <div>
              <h4 className="font-bold">{video.title}</h4>
              <p className="text-sm text-gray-500">ID: {video.id}</p>
            </div>
          </div>
          <a href={videoUrl(video)} target="_blank"
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
      {notification && (
        <InfoDialog
          title={notification.success ? '好耶！' : '坏耶...'}
          message={notification.message}
          onOkClick={() => {
            setNotification(null)
            if (notification?.success)
              handleCloseModal();
          }}/>
      )}
    </div>
  );
}

export default ReceiptDialog;
