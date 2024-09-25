"use client";

export const runtime = "nodejs";

import dynamic from "next/dynamic";

const PlyrNoSSR = dynamic(
  () => import("../../components/PlyrWrapper"),
  { ssr: false }
);

export default function DancePage() {
  return (
    <>
      <PlyrNoSSR />
    </>
  );
}
