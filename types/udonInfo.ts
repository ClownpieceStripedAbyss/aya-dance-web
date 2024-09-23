import fetchWithDefaults from "@/utils/service";

export interface UdonVideoIndex {
  time: string;
  groups: UdonGroup[];
  tags?: Tags;
  udonFiles?: UdonVideoFile[];
  udonUrls?: UdonVideoUrl[];
  loading?: boolean;
}

// https://api.udon.dance/Api/Songs/files
export interface UdonVideoFile {
  id: number;
  md5: string;
}

// https://api.udon.dance/Api/Songs/url
export interface UdonVideoUrl {
  id: number,
  url: string,
}

export interface UdonGroup {
  groupName: string;
  major: string;
  songInfos?: UdonVideo[];
}

export interface UdonVideo {
  id: number;
  danceid: number;
  name: string;
  artist: string;
  dancer: string;
  playerCount: number;
  volume: number;
  start: number;
  end: number;
  flip: boolean;
  tag: string[] | null;
  double_width: boolean;
}

export interface UdonTag {
  en: string;
  cn: string;
  jp: string;
  kr: string;
}

export interface Tags {
  [key: string]: UdonTag;
}

export async function fetchUdonInfo(): Promise<UdonVideoIndex> {
  const data = await fetchWithDefaults("https://api.udon.dance/Api/Songs/list");

  return {
    ...data,
    groups: data.groups.contents,
  } as UdonVideoIndex;
}

export async function fetchUdonFiles(): Promise<UdonVideoFile[]> {
  return await fetchWithDefaults("https://api.udon.dance/Api/Songs/files");
}

export async function fetchUdonUrls(): Promise<UdonVideoUrl[]> {
  return await fetchWithDefaults("https://api.udon.dance/Api/Songs/url");
}
