import {HeroSection} from "@/features/home/components/hero-section"
import { GithubIcon } from "@/shared/components/icons/github-icon"

export default function Home() {
    return (<div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
            <main className="flex-1">
                <HeroSection/>
            </main>

            <footer className="py-8 border-t bg-background/50 backdrop-blur-sm">
                <div className="container flex flex-col items-center justify-center gap-3">
                    <p className="text-sm text-muted-foreground text-center">
                        &copy; 2026 Git Ranker. All rights reserved.
                    </p>
                    <a
                        href="https://github.com/alexization"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
                    >
                        <GithubIcon className="h-4 w-4"/>
                        <span>alexization</span>
                    </a>
                </div>
            </footer>
        </div>)
}