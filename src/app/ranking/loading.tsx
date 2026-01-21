import { Skeleton } from "@/shared/components/skeleton"

export default function RankingLoading() {
    return (
        <div className="min-h-screen bg-background pb-20 pt-16">
            <div className="container max-w-5xl px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <Skeleton className="h-16 w-64 mx-auto mb-3" />
                    <Skeleton className="h-6 w-48 mx-auto" />
                </div>

                {/* Tier Filter */}
                <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-4 mb-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-20 rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Table Header */}
                <Skeleton className="h-12 w-full rounded-xl mb-3 hidden md:block" />

                {/* Ranking List */}
                <div className="space-y-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="h-16 md:h-20 w-full rounded-2xl"
                            style={{ opacity: 1 - i * 0.05 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
