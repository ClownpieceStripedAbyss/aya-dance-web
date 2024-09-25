export default function DanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="relative flex flex-row items-center justify-center gap-4 py-4 md:py-4 h-full">
      {children}
    </section>
  )
}
