import React, { useEffect, useMemo, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { delay } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { nextVideoWithRandom, selectPlayList } from "@/store/modules/playList";
import styles from "./index.module.css";
import { selectSongInfo } from "@/store/modules/songInfo";
import { Autocomplete, AutocompleteItem, Spinner } from "@nextui-org/react";
import { selectPlayOptions } from "@/store/modules/playOptions";
import { computeNextQueueCandidates, findSongEntries, GenericVideo, GROUP_ALL_SONGS } from "@/types/video";
import { selectCollection } from "@/store/modules/collection";
import { selectCustomListStore } from "@/store/modules/customPlaylist";

enum DoubleWidthShowMode {
  Both, Original, Simplified
}

interface VideoPlayerProps {
}

const formatDoubleWidthShowMode = (mode: DoubleWidthShowMode) => {
  switch (mode) {
    case DoubleWidthShowMode.Both:
      return "全部";
    case DoubleWidthShowMode.Original:
      return "原版";
    case DoubleWidthShowMode.Simplified:
      return "简化";
  }
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({}) => {
  const { playList, version } = useSelector(selectPlayList);
  const { songTypes } = useSelector(selectSongInfo);
  const collection = useSelector(selectCollection);
  const customList = useSelector(selectCustomListStore);
  const { lockedRandomGroup } = useSelector(selectPlayOptions);
  const dispatch = useDispatch();

  const queue = useMemo(() => playList[0] ?? null, [playList]);
  const lockedRandomGroupOrAll = lockedRandomGroup && findSongEntries(songTypes, lockedRandomGroup.group, lockedRandomGroup.isCustom, collection, customList).length > 0
    ? lockedRandomGroup.group
    : GROUP_ALL_SONGS;
  const onVideoEnded = (randomGroup: GenericVideo[]) => {
    console.log(`OnVideoEnded: Handle next random range`);
    dispatch(nextVideoWithRandom(randomGroup));
  };

  const [doubleWidthShowMode, setDoubleWidthShowMode] = useState<DoubleWidthShowMode>(DoubleWidthShowMode.Original);
  const combinedVideoOptions = [
    { value: `${DoubleWidthShowMode.Original}`, label: "原版" },
    { value: `${DoubleWidthShowMode.Simplified}`, label: "简化" },
    { value: `${DoubleWidthShowMode.Both}`, label: "全部" }
  ];

  const hasSM = queue?.video.shaderMotion.length > 0 ?? false;

  // IMPORTANT: use `http`, so our self-hosted CDN can serve the video locally! DONT USE `https`!
  const videoUrl = queue ? `http://api.udon.dance/Api/Songs/play?id=${queue.video.id}` : "";
  const flip = queue?.video.flip ?? false;
  const doubleWidth = queue?.video.doubleWidth ?? false;
  const volume = queue?.video.volume ?? 0.514;

  const videoInfo = queue ? `${queue.video.id}. ${queue.video.composedTitle} ${doubleWidth ? `(${formatDoubleWidthShowMode(doubleWidthShowMode)})` : ""} ${queue.isRandom ? " | 随机" : ""}` : "";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const plyrInstance = useRef<Plyr | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const spinnerRef = useRef<HTMLDivElement | null>(null);

  const MAX_WAIT_COUNT_DOWN = 15;
  const [waitCountDown, setWaitCountDown] = useState(MAX_WAIT_COUNT_DOWN);

  const resumePlayCounter = useRef<number>(0);
  const prevVideoUrlRef = useRef<string>("");

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoUrl === "") return;

    console.log(`Got new video url: ${videoUrl}, old video url: ${prevVideoUrlRef.current}`);
    if (prevVideoUrlRef.current === videoUrl) {
      console.log("Same video URL, skipping initialization");
      return;
    }
    prevVideoUrlRef.current = videoUrl;

    if (!videoRef.current) {
      console.log("VideoRef is null, do not creating Plyr instance");
      return;
    }

    // Now create a new Plyr instance for different video urls
    plyrInstance.current = new Plyr(videoRef.current, {
      // IMPORTANT: no autoplay/autopause here, we will handle it manually,
      // or race condition happens when the first video is loaded:
      // the video starts to play, and seconds later the video is paused.
      autoplay: false,
      autopause: false
    });
    plyrInstance.current.on("ended", () => {
      // TODO: workaround JavaScript unreasonable capturing behavior
      let nextEntries = computeNextQueueCandidates(songTypes, collection, customList, lockedRandomGroup);
      // TODO: end workaround

      onVideoEnded(nextEntries);
    });
    plyrInstance.current.on("playing", () => {
      if (spinnerRef.current) spinnerRef.current.style.display = "none";
    });
    plyrInstance.current.on("loadeddata", () => {
      // This enforces the video to play when the video is loaded;
      // the "autoplay" option works only on the first video,
      // for videos that are loaded after the first one, we need to call play() manually

      // SetTimeout is not reliable, let's compute Date on our own
      const now = Date.now();
      // The Y-combinator
      // const Y = (f: any) => (g => g(g))((g: any) => f((x: any) => g(g)(x)))

      // capture by value
      const counterCopy = resumePlayCounter.current;
      const resumePlay = () => {
        if (counterCopy !== resumePlayCounter.current) {
          console.log("Resume video counter mismatch, aborting this count down");
          return;
        }
        const elapsed = Date.now() - now;
        console.log(`Elapsed: ${elapsed}, waitCountDown: ${Math.max(0, MAX_WAIT_COUNT_DOWN - Math.floor(elapsed / 1000))}`);
        setWaitCountDown(Math.max(0, MAX_WAIT_COUNT_DOWN - Math.floor(elapsed / 1000)));
        if (elapsed >= MAX_WAIT_COUNT_DOWN * 1000) {
          plyrInstance.current?.play();
        } else {
          // WOW! Dynamic scoping! No Y-combinator needed!
          delay(resumePlay, 1000);
        }
      };

      delay(resumePlay, 1000);
    });
    // Setup inline progress bar
    // plyrInstance.current.on("timeupdate", () => {
    //   if (videoRef.current) {
    //     const currentTime = videoRef.current.currentTime;
    //     const duration = videoRef.current.duration;
    //     setProgress(currentTime / duration);
    //   }
    // });
    if (overlayRef.current) overlayRef.current.style.display = "block";

    // For a new video, show the spinner and reset resume timer to 15s,
    // and increment the resume counter.
    // NOTE: don't do this in "ended" event, because the "ended" event is not fired
    // then the video is directly skipped to the next one.
    if (spinnerRef.current) spinnerRef.current.style.display = "block";
    setWaitCountDown(MAX_WAIT_COUNT_DOWN);
    resumePlayCounter.current++;

    muteAndUnmuteAfterDelay();
    applyScreenEffect(doubleWidthShowMode, hasSM);
    // This enforces the video to reload when the videoUrl changes
    videoRef.current.load();

    // setup the loading spinner and fullscreen info overlay
    const plyrContainer = videoRef.current?.parentElement?.parentElement;
    if (overlayRef.current) plyrContainer?.append(overlayRef.current);
    if (spinnerRef.current) plyrContainer?.append(spinnerRef.current);
  }, [videoUrl, version]);

  const muteAndUnmuteAfterDelay = (delay = 1000) => {
    if (plyrInstance.current) {
      plyrInstance.current.muted = true;
      setTimeout(() => {
        if (plyrInstance.current) {
          plyrInstance.current.muted = false;
          plyrInstance.current.volume = volume;
        }
      }, delay);
    }
  };

  const applyScreenEffect = (doubleWidthShowMode: DoubleWidthShowMode, hasSM: boolean) => {
    if (!videoRef.current) return;
    const wrapper = videoRef.current.closest(
      ".plyr__video-wrapper"
    ) as HTMLElement;
    if (wrapper) {
      console.log(`Applying screen effect for flip=${flip}, doubleWidth=${doubleWidth}, doubleWidthShowMode=${doubleWidthShowMode}, hasSM=${hasSM}`);
      let scaleX = flip ? -1 : 1;
      let scaleY = 1;
      let translateX = 0;
      if (!hasSM) {
        if (doubleWidth && doubleWidthShowMode === DoubleWidthShowMode.Original) {
          scaleX = flip ? -2 : 2;
          translateX = 25;
        }
        if (doubleWidth && doubleWidthShowMode === DoubleWidthShowMode.Simplified) {
          scaleX = flip ? -2 : 2;
          translateX = -25;
        }
        if (doubleWidth && doubleWidthShowMode === DoubleWidthShowMode.Both) {
          scaleY = 0.5;
        }
      } else {
        if (doubleWidth) {
          // 48:9 video
          if (doubleWidthShowMode === DoubleWidthShowMode.Original) {
            translateX = 33.3;
            scaleX = flip ? -3 : 3;
            scaleY = 3;
          } else if (doubleWidthShowMode === DoubleWidthShowMode.Simplified) {
            translateX = 0;
            scaleX = flip ? -3 : 3;
            scaleY = 3;
          } else if (doubleWidthShowMode === DoubleWidthShowMode.Both) {
            translateX = 16.65;
            scaleX = flip ? -1.5 : 1.5;
            scaleY = 1.5;
          }
        } else {
          // show the original video
          scaleX = flip ? -2 : 2;
          translateX = 25;
        }
      }

      wrapper.style.transform = `scaleX(${scaleX}) scaleY(${scaleY}) translateX(${translateX}%)`;
    }
  };

  return (
    <div className="w-full h-full">
      {/*<h1*/}
      {/*  className="mb-4 text-4xl font-extrabold text-center leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">*/}
      {/*  {videoInfo}*/}
      {/*</h1>*/}
      {/*<div ref={overlayRef}*/}
      {/*     className={`${styles.overlay} text-4xl font-extrabold text-center leading-none tracking-tight bg-gray-500 bg-opacity-50 text-white hidden`}>*/}
      {/*  <h1>{videoInfo}</h1>*/}
      {/*</div>*/}
      <div
        ref={overlayRef}
        className={`
          ${styles.overlay}
          relative inline-block overflow-hidden         
          text-4xl font-extrabold text-center leading-none tracking-tight
          bg-gray-500 bg-opacity-50 text-white
        `}
      >
        {/* —— 进度条背景 —— */}
        <div
          className="
            absolute top-0 left-0 h-full
            bg-blue-300 opacity-50
            transition-all duration-300 ease-linear
          "
          style={{ width: `${(progress * 100)}%` }}
        />

        {/* —— 标题文字 —— */}
        <h1 className="relative z-10">
          {videoInfo}
        </h1>
      </div>
      <div ref={spinnerRef}
           className={`${styles.overlay} text-center leading-none tracking-tight w-full h-full bg-black bg-opacity-90 hidden`}>
        <div
          className={`${styles.overlay} text-6xl font-extrabold text-center leading-none tracking-tight bg-black text-white`}>
          <h1>{videoInfo}</h1>
          <h1>{waitCountDown}</h1>
        </div>
        <Spinner size="lg" className="h-full scale-150" />
      </div>
      <video ref={videoRef} controls className="plyr__video-embed">
        <source src={videoUrl} type="video/mp4" className=" w-full h-full" />
      </video>
      <span>Flip: {flip ? "true" : "false"}, Combined: {doubleWidth ? "true" : "false"}, Locked Random: {lockedRandomGroupOrAll}, ShaderMotion: {queue?.video.shaderMotion.join(", ") ?? ""}</span>
      <br />
      <Autocomplete
        aria-label="change rows per page"
        className="w-[130px]"
        defaultItems={combinedVideoOptions}
        isClearable={false}
        selectedKey={`${doubleWidthShowMode}`}
        onSelectionChange={(key) => {
          console.log("DoubleWidthShowMode changed to", key);
          if (key !== null) {
            let mode = Number(key) as DoubleWidthShowMode;
            setDoubleWidthShowMode(mode);
            applyScreenEffect(mode, hasSM);
          }
        }}
      >
        {combinedVideoOptions.map((option) => (
          <AutocompleteItem key={option.value} value={option.value}>
            {option.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>
      {/*<span>ShaderMotion Video Legalizer: {hasSM}</span>*/}
      {/*<Checkbox*/}
      {/*  checked={hasSM}*/}
      {/*  onChange={value => {*/}
      {/*    const checked = value.target.checked;*/}
      {/*    setHasSM(checked);*/}
      {/*    applyScreenEffect(doubleWidthShowMode, checked);*/}
      {/*  }}*/}
      {/*/>*/}
    </div>
  );
};

export default VideoPlayer;
