import { Skeleton } from "@/shared/components/skeleton"

export default function UserProfileLoading() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <main className="pt-20 px-4">
                <div className="container max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center gap-6 mb-12">
                        {/* Avatar */}
                        <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />

                        {/* Username & Tier */}
                        <div className="text-center space-y-3">
                            <Skeleton className="h-10 w-48 mx-auto" />
                            <Skeleton className="h-8 w-32 mx-auto rounded-full" />
                        </div>

                        {/* Stats Row */}
                        <div className="flex gap-8 mt-4">
                            <div className="text-center">
                                <Skeleton className="h-8 w-20 mb-2" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                            <div className="text-center">
                                <Skeleton className="h-8 w-16 mb-2" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <div className="text-center">
                                <Skeleton className="h-8 w-24 mb-2" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        </div>
                    </div>

                    {/* Score Breakdown Card */}
                    <div className="bg-card border border-border/50 rounded-3xl p-6 mb-8">
                        <Skeleton className="h-6 w-32 mb-6" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="text-center p-4">
                                    <Skeleton className="h-10 w-16 mx-auto mb-2" />
                                    <Skeleton className="h-4 w-20 mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Chart */}
                    <div className="bg-card border border-border/50 rounded-3xl p-6">
                        <Skeleton className="h-6 w-40 mb-6" />
                        <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                </div>
            </main>
        </div>
    )
}
