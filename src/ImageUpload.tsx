import { useState } from "react";
import { Socket } from "socket.io-client";

const ImageUpload = ({
  socket,
  setImageList,
}: {
  socket: Socket;
  setImageList: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (!reader || !reader.result) return;
      const imageBuffer = reader.result;
      socket.emit("send_image", { image: imageBuffer, room: "room" });
      setImageList((prev) => [...prev, imageBuffer.toString()]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUpload;
