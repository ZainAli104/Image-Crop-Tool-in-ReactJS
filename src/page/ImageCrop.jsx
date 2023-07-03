import React, { useState, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Compressor from "compressorjs";

import { canvasPreview } from "../utils/canvasPreview";

export default function App() {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function centerAspectCrop(imgWidth, imgHeight) {
    const size = Math.min(imgWidth, imgHeight);

    return {
      unit: "px",
      width: size,
      height: size,
      x: (imgWidth - size) / 2,
      y: (imgHeight - size) / 2,
    };
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height));
  }

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error("Crop canvas does not exist");
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create blob");
      }

      new Compressor(blob, {
        quality: 0.8,
        success: (compressedResult) => {
          const blobUrl = URL.createObjectURL(compressedResult);
          hiddenAnchorRef.current.href = blobUrl;
          hiddenAnchorRef.current.download = "croped-image.png";
          hiddenAnchorRef.current.click();
        },
      });
    }, "image/png");
  }

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop,
        scale,
        rotate
      );
    }
  }, [completedCrop, scale, rotate]);

  return (
    <section className="max-w-7xl mx-auto bg-gray-200 p-14 rounded-xl min-h-screen">
      <div className="mb-6">
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          Image Crop Tool
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Select an image and crop it, then download the cropped version.
        </p>
        <p className="mt-2 text-[#666e75] text-[16px] max-w[500px]">
          Copyright © 2023 <span className="font-bold">ShouldiRenovate</span>.
          All rights reserved.
        </p>
      </div>

      <div className="App flex flex-col items-center justify-center ">
        <div className="Crop-Controls mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="py-2 px-4 bg-blue-500 text-white rounded-md cursor-pointer"
          />
        </div>
        {!!imgSrc && (
          <div className="flex justify-center items-center bg-white rounded-md max-w-2xl w-full">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              className="w-full h-full"
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                onLoad={onImageLoad}
                className="w-full h-full object-contain"
              />
            </ReactCrop>
          </div>
        )}
        {!!completedCrop && (
          <div className="mt-4">
            <canvas
              ref={previewCanvasRef}
              className="border-black border border-solid"
              style={{
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
            <div className="mt-4">
              <button
                onClick={onDownloadCropClick}
                className="py-2 px-4 bg-green-500 text-white rounded-md cursor-pointer"
              >
                Download Crop
              </button>
              <a
                ref={hiddenAnchorRef}
                download
                style={{
                  position: "absolute",
                  top: "-200vh",
                  visibility: "hidden",
                }}
              >
                Hidden download
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
