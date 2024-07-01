import React, { useState } from "react";
import { toPng } from "html-to-image";
import imageCompression from 'browser-image-compression';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quality, setQuality] = useState(0.8); // Default quality level

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleResize = async () => {
    const img = new Image();
    img.src = image;
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      const compressedFile = await imageCompression.getFilefromDataUrl(dataUrl, "resized-image.jpg");
      const compressedDataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
      const link = document.createElement("a");
      link.download = "resized-image.jpg";
      link.href = compressedDataUrl;
      link.click();
    };
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center bg-cover"
      style={{ backgroundImage: "url('/sea-background.jpg')" }}
    >
      <h1 className="text-3xl text-center mb-4">Image Resizer</h1>
      <Input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div className="mt-4">
          <img src={image} alt="Uploaded" className="max-w-full h-auto mb-4" />
          <div className="flex space-x-2 mb-4">
            <Input
              type="number"
              placeholder="Width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Quality (0.1 - 1.0)"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
            />
          </div>
          <Button onClick={handleResize}>Resize Image</Button>
        </div>
      )}
    </div>
  );
};

export default Index;