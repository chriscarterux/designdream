"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";

interface LandingHeroVideoProps {
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  posterImage?: string;
  videoUrl?: string;
}

export default function LandingHeroVideo({
  autoPlay = false,
  showControls = true,
  className = "",
  posterImage = "/videos/hero-poster.jpg",
  videoUrl = "/videos/hero-video.mp4",
}: LandingHeroVideoProps) {
  const [isMuted, setIsMuted] = useState(!autoPlay);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoRef, setVideoRef] = React.useState<HTMLVideoElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef) return;

    if (isPlaying) {
      videoRef.pause();
    } else {
      videoRef.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef) return;
    videoRef.muted = !videoRef.muted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (
        (containerRef.current as any).webkitRequestFullscreen
      ) {
        (containerRef.current as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleLoadedMetadata = () => {
    if (videoRef && autoPlay) {
      videoRef.play().catch(() => {
        // Autoplay may be blocked by browser
        setIsPlaying(false);
      });
    }
  };

  const controlVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  const buttonHoverVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg bg-black shadow-2xl ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      } ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Container */}
      <div className="relative w-full pt-[56.25%]">
        <video
          ref={setVideoRef}
          className="absolute inset-0 h-full w-full"
          poster={posterImage}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onLoadedMetadata={handleLoadedMetadata}
          muted={isMuted}
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Play Button (when not playing) */}
        {!isPlaying && showControls && (
          <motion.button
            className="absolute inset-0 flex items-center justify-center"
            onClick={togglePlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Play video"
          >
            <motion.div
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Play className="ml-1 h-8 w-8 fill-blue-600 text-blue-600" />
            </motion.div>
          </motion.button>
        )}

        {/* Control Bar */}
        {showControls && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-4 sm:px-6 sm:py-6"
            variants={controlVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center gap-2">
              {/* Play/Pause Button */}
              <motion.button
                onClick={togglePlay}
                className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/20"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-white" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-white" />
                )}
              </motion.button>

              {/* Mute Button */}
              <motion.button
                onClick={toggleMute}
                className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/20"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </motion.button>
            </div>

            {/* Fullscreen Button */}
            <motion.button
              onClick={toggleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded text-white hover:bg-white/20"
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
