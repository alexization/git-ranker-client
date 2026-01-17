import { HeroSection } from "@/features/home/components/hero-section"
import { RankingSection } from "@/features/ranking/components/ranking-section"

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      <main className="flex-1">
        <HeroSection />
        <RankingSection />
      </main>
      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <a
              href="https://github.com/alexization"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Alexization
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/alexization/git-ranker"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}