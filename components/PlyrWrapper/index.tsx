import React, { useEffect, useRef } from "react"
import Plyr from "plyr"
import "plyr/dist/plyr.css"

interface VideoPlayerProps {
  videoUrl: string
  flip?: boolean
  onVideoEnded?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  flip = false,
  onVideoEnded,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const plyrInstance = useRef<Plyr | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      plyrInstance.current = new Plyr(videoRef.current, {
        autoplay: true,
      })

      plyrInstance.current.on("ended", () => {
        if (onVideoEnded) {
          onVideoEnded()
        }
      })

      muteAndUnmuteAfterDelay()
      applyFlipEffect()
    }

    return () => {
      if (plyrInstance.current) {
        plyrInstance.current.destroy()
      }
    }
  }, [videoUrl])

  const muteAndUnmuteAfterDelay = (delay = 1000) => {
    if (plyrInstance.current) {
      plyrInstance.current.muted = true
      setTimeout(() => {
        if (plyrInstance.current) {
          plyrInstance.current.muted = false
          plyrInstance.current.volume = 1
        }
      }, delay)
    }
  }

  const applyFlipEffect = () => {
    if (videoRef.current) {
      const wrapper = videoRef.current.closest(
        ".plyr__video-wrapper"
      ) as HTMLElement
      if (wrapper) {
        wrapper.style.transform = flip ? "scaleX(-1)" : "scaleX(1)"
      }
    }
  }

  return (
    <div>
      <video ref={videoRef} controls className="plyr__video-embed">
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  )
}

export default VideoPlayer
