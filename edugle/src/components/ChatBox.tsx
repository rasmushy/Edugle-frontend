import React from "react";

type ChatBoxProps = {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleUploadImage: () => void;
  handleInsertEmoji: () => void;
};

const ChatBox: React.FC<ChatBoxProps> = ({
  message,
  setMessage,
  handleSendMessage,
  handleKeyPress,
  handleUploadImage,
  handleInsertEmoji,
}) => {
  return (
      <div className="min-w-fit max-w-screen">
      <div className="relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows={3}
          className="flex w-full rounded pl-3 pr-16 text-black"
          onKeyDown={handleKeyPress}
        />
        <div className="absolute bottom-0 right-0 flex h-full items-center pr-2">
          <button
            onClick={handleUploadImage}
            className="mx-1 rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            📷
          </button>
          <button
            onClick={handleInsertEmoji}
            className="mx-1 rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            😃
          </button>
          <button
            onClick={handleSendMessage}
            className="mx-1 rounded bg-[hsl(280,100%,70%)] p-2 text-white"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
