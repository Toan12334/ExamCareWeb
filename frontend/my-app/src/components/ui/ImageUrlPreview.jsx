import { useState } from "react";

export default function ImageUrlPreview({
  src,
  alt = "image",
  className = "",
  imgClassName = "",
  fallback = "Không tải được ảnh",
  fit = "cover", // cover | contain | fill
  rounded = "rounded-xl",
  showBorder = true,
  openInNewTab = true,
}) {
  const images = Array.isArray(src)
    ? src.map((item) =>
        typeof item === "string" ? item : item?.ImageUrl
      )
    : [src];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorIndexes, setErrorIndexes] = useState([]);

  const fitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  };

  const handleError = (index) => {
    setErrorIndexes((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  };

  const currentImage = images[currentIndex];
  const isError = !currentImage || errorIndexes.includes(currentIndex);

  return (
    <div
      className={`w-full overflow-hidden bg-gray-100 ${
        showBorder ? "border border-gray-200" : ""
      } ${rounded} ${className}`}
    >
      {isError ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-500">
          {fallback}
        </div>
      ) : (
        <a
          href={currentImage}
          target={openInNewTab ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={currentImage}
            alt={alt}
            onError={() => handleError(currentIndex)}
            className={`h-64 w-full cursor-pointer ${fitClass[fit]} ${imgClassName}`}
          />
        </a>
      )}

      {images.length > 1 && (
        <div className="flex items-center justify-between p-2">
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            className="rounded bg-gray-200 px-2 py-1 text-sm"
          >
            ◀
          </button>

          <span className="text-xs text-gray-500">
            {currentIndex + 1} / {images.length}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
            className="rounded bg-gray-200 px-2 py-1 text-sm"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}