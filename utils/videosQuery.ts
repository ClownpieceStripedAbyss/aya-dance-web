import { GenericVideo } from "@/types/video"

export default function videosQuery(
  videos: GenericVideo[],
  query: string
): GenericVideo[] {
  const VaguelyMatches = (kw: string[], titleSpell: string) => {
    if (kw.length === 0) return false

    const spell = titleSpell.split(" ")

    if (kw.length > spell.length) return false

    return spell.some((_, i) =>
      kw.every((keyword, j) => spell[i + j]?.startsWith(keyword))
    )
  }

  const IdMatches = (query: string, id: number) => {
    return query === id.toString() || id.toString().includes(query)
  }

  function videoMatchesQuery(video: GenericVideo, query: string) {
    const lowerQuery = query.toLowerCase()
    const keywords = lowerQuery.split(" ")
    const fuzzyKeywords =
      lowerQuery.indexOf(" ") === -1 ? Array.from(lowerQuery) : null

    return [
      fuzzyKeywords &&
        VaguelyMatches(fuzzyKeywords, video.composedTitleSpell.toLowerCase()),
      fuzzyKeywords &&
        VaguelyMatches(fuzzyKeywords, video.composedTitle.toLowerCase()),
      VaguelyMatches(keywords, video.composedTitleSpell.toLowerCase()),
      VaguelyMatches(keywords, video.composedTitle.toLowerCase()),
      IdMatches(lowerQuery, video.id),
      [video.artist, video.dancer, video.name].some((s) =>
        s.toLowerCase().includes(lowerQuery)
      ),
      video.ayaId && IdMatches(lowerQuery, video.ayaId),
    ].some(Boolean)
  }

  if (!query || query.length === 0) return videos
  return videos.filter((video) => {
    return videoMatchesQuery(video, query)
  })
}
