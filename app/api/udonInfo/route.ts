import type { UdonInfo } from "@/types/udonInfo";

import fetchWithDefaults from "@/utils/service";

export const revalidate = 60;

export async function GET() {
  const data = await fetchWithDefaults("https://api.udon.dance/Api/Songs/list");
  const UdonInfo: UdonInfo = {
    ...data,
    groups: data.groups.contents,
  };

  return new Response(JSON.stringify(UdonInfo), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
