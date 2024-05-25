import React from "react";

interface InfoDialogProps {
  title: string;
  message: string;
  onOkClick?: () => void;
}

const InfoDialog: React.FC<InfoDialogProps> = ({ title, message, onOkClick }) => {
  return (
    <div className="z-20 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <p>{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onOkClick}
            className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-700 transition"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoDialog;
