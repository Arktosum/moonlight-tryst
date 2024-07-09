import { ChangeEvent } from "react";

const ImageUpload = ({
  readImageBuffer,
}: {
  readImageBuffer: (imageBuffer: string | undefined) => void;
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleUpload(file);
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageBuffer = reader.result;
      readImageBuffer(imageBuffer?.toString());
    };
    reader.readAsDataURL(file);
  };

  return <input type="file" onChange={handleFileChange} />;
};

export default ImageUpload;
