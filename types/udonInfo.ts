import fetchWithDefaults from "@/utils/service";

export interface UdonInfo {
  loading?: boolean;
  time: string;
  groups: Group[];
  tags?: Tags;
  udonFiles?: UdonVideoFile[];
}

export interface UdonDanceVideoIndex {
  time: string;
  groups: UdonDanceGroup;
}

export interface UdonDanceGroup {
  contents: UdonDanceContent[];
}

export interface UdonDanceContent {
  groupName: string;
  UdonInfos: UdonDanceUdonInfo[] | null;
}

export interface UdonVideoFile {
  id: number;
  md5: string;
}

export interface UdonDanceUdonInfo {
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
}

export interface Group {
  groupName: string;
  major: string;
  songInfos?: Video[];
  UdonInfos?: UdonDanceUdonInfo[] | null;
}

export interface Video {
  artist: string;
  danceid: number;
  dancer: string;
  double_width: boolean;
  end: number;
  flip: boolean;
  id: number;
  name: string;
  playerCount: number;
  start: number;
  tag: string | null;
  volume: number;
}

export interface Tag {
  en: string;
  cn: string;
  jp: string;
  kr: string;
}

export interface Tags {
  [key: string]: Tag;
}

export async function fetchUdonInfo(): Promise<UdonInfo> {
  const data = await fetchWithDefaults("https://api.udon.dance/Api/Songs/list");

  return {
    ...data,
    groups: data.groups.contents,
  } as UdonInfo;
}

export async function fetchUdonFiles(): Promise<UdonVideoFile[]> {
  return await fetchWithDefaults("https://api.udon.dance/Api/Songs/files");
}
