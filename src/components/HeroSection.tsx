"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Effect to handle video playback with better iOS support
  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Make sure video is definitely muted (important for iOS)
    video.muted = true;

    // Function to safely attempt video playback
    const attemptPlay = async () => {
      try {
        // First, ensure video is ready by loading metadata
        if (video.readyState === 0) {
          await new Promise((resolve) => {
            video.addEventListener("loadedmetadata", resolve, { once: true });
          });
        }

        // Try to play
        await video.play();
        console.log("Video playback started successfully");
        setIsVideoLoaded(true);
      } catch (err) {
        console.log("Autoplay prevented:", err);

        // Handle autoplay prevention with user interaction handler
        const userInteractionHandler = () => {
          video
            .play()
            .then(() => {
              console.log("Video started after user interaction");
              setIsVideoLoaded(true);

              // Clean up event listeners
              ["click", "touchstart", "keydown"].forEach((event) => {
                document.removeEventListener(event, userInteractionHandler);
              });
            })
            .catch((error) =>
              console.error("Failed to play after interaction:", error)
            );
        };

        // Add multiple event listeners for better coverage
        ["click", "touchstart", "keydown"].forEach((event) => {
          document.addEventListener(event, userInteractionHandler);
        });

        // Create a visible play button for iOS
        const playButton = document.createElement("button");
        playButton.textContent = "Tap to Play Video";
        playButton.style.position = "absolute";
        playButton.style.zIndex = "20";
        playButton.style.top = "50%";
        playButton.style.left = "50%";
        playButton.style.transform = "translate(-50%, -50%)";
        playButton.style.padding = "12px 24px";
        playButton.style.backgroundColor = "#22c55e"; // green-500
        playButton.style.color = "#111827"; // gray-900
        playButton.style.borderRadius = "6px";
        playButton.style.fontWeight = "bold";
        playButton.style.cursor = "pointer";
        playButton.style.border = "none";

        playButton.addEventListener("click", () => {
          userInteractionHandler();
          playButton.remove();
        });

        // Only add the button if video isn't playing
        if (video.paused) {
          document.body.appendChild(playButton);

          // Remove button after 10 seconds to prevent UI clutter
          setTimeout(() => {
            if (document.body.contains(playButton)) {
              playButton.remove();
            }
          }, 10000);
        }
      }
    };

    // Start the playback attempt
    attemptPlay();

    // Cleanup function
    return () => {
      ["click", "touchstart", "keydown"].forEach((event) => {
        document.removeEventListener(event, () => {});
      });

      // Stop video playback on unmount
      if (video && !video.paused) {
        video.pause();
      }
    };
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden w-screen">
      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden w-screen">
        {!isVideoLoaded && (
          <div className="absolute w-full h-full bg-gray-900"></div>
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute w-screen min-h-full object-cover video-main"
          onCanPlayThrough={() => setIsVideoLoaded(true)}
          poster="/video-poster.jpg"
          style={{
            filter: "brightness(0.5)",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            data-nosnippet
          >
            WELCOME TO <span className="text-green-500">WW Zov</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Airsoft Arena: STALKER Zone is a meeting place for all who seek real
            adventures in the Zone. Join the ranks of stalkers, obtain valuable
            artifacts, complete tasks and beware of enemies. Our scenario games
            recreate the atmosphere of the STALKER world. Choose your path in
            the Exclusion Zone.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-green-500 text-gray-900 font-bold rounded-md text-lg hover:bg-green-400 transition-colors"
          >
            JOIN THE NEXT RAID
          </motion.button>
        </motion.div>
      </div>

      {/* Scrolldown indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
