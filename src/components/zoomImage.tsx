import React, { useRef, useState } from "react";

type ZoomImageProps = {
    src: string;
    zoomScale?: number;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
};

const ZoomImage: React.FC<ZoomImageProps> = ({
    src,
    zoomScale = 2,
    alt = "Zoomed Image",
    className = "",
    width = 800,
    height = 600,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
    const [isZoomed, setIsZoomed] = useState(false);

    const updatePosition = (clientX: number, clientY: number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        setBackgroundPosition(`${x}% ${y}%`);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        if (touch) {
            updatePosition(touch.clientX, touch.clientY);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden rounded-lg ${className}`}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsZoomed(true)}
            onTouchEnd={() => setIsZoomed(false)}
            onTouchMove={handleTouchMove}
            style={{
                cursor: isZoomed ? "zoom-out" : "zoom-in",
                backgroundImage: isZoomed ? `url(${src})` : "none",
                backgroundSize: `${zoomScale * 100}%`,
                backgroundPosition,
                backgroundRepeat: "no-repeat",
                transition: "background-position 0.2s ease, background-size 0.3s ease",
            }}
        >
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`w-full h-auto block pointer-events-none select-none transition-opacity duration-300 ${isZoomed ? "opacity-0" : "opacity-100"
                    }`}
                draggable={false}

            />
        </div>
    );
};

export default ZoomImage;
