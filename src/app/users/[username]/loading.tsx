import { Skeleton } from "@/shared/components/skeleton"

export default function UserProfileLoading() {
    return (
        <div className="min-h-screen bg-background pb-20">
            <main className="pt-12 px-4">
                <div className="container max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-4">
                            <div className="rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-xl p-8 flex flex-col items-center">
                                {/* Avatar */}
                                <Skeleton
                                    className="h-36 w-36 rounded-full mb-5"
                                    style={{ animationDelay: '0s' }}
                                />

                                {/* Username */}
                                <Skeleton
                                    className="h-8 w-40 mb-2 rounded-xl"
                                    style={{ animationDelay: '0.1s' }}
                                />

                                {/* Tier Badge */}
                                <Skeleton
                                    className="h-8 w-28 rounded-full mb-8"
                                    style={{ animationDelay: '0.15s' }}
                                />

                                {/* Score Section */}
                                <div className="w-full p-4 rounded-2xl bg-secondary/30 mb-8">
                                    <Skeleton
                                        className="h-4 w-24 mx-auto mb-2 rounded-lg"
                                        style={{ animationDelay: '0.2s' }}
                                    />
                                    <Skeleton
                                        className="h-14 w-48 mx-auto mb-2 rounded-xl"
                                        style={{ animationDelay: '0.25s' }}
                                    />
                                    <Skeleton
                                        className="h-4 w-20 mx-auto rounded-lg"
                                        style={{ animationDelay: '0.3s' }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="w-full space-y-3">
                                    <Skeleton
                                        className="h-12 w-full rounded-2xl"
                                        style={{ animationDelay: '0.35s' }}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Skeleton
                                            className="h-11 rounded-2xl"
                                            style={{ animationDelay: '0.4s' }}
                                        />
                                        <Skeleton
                                            className="h-11 rounded-2xl"
                                            style={{ animationDelay: '0.45s' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Stats & Activity */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Stats Radar Chart */}
                            <div className="rounded-[2.5rem] border border-border/50 bg-card/50 backdrop-blur-xl p-6">
                                <Skeleton
                                    className="h-6 w-32 mb-2 rounded-xl"
                                    style={{ animationDelay: '0.5s' }}
                                />
                                <Skeleton
                                    className="h-4 w-48 mb-6 rounded-lg"
                                    style={{ animationDelay: '0.55s' }}
                                />
                                <Skeleton
                                    className="h-[350px] w-full rounded-2xl"
                                    style={{ animationDelay: '0.6s' }}
                                />
                            </div>

                            {/* Activity Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-32 rounded-[1.5rem]"
                                        style={{ animationDelay: `${0.7 + i * 0.05}s` }}
                                    />
                                ))}
                            </div>

                            {/* Badge Generator */}
                            <Skeleton
                                className="h-40 rounded-[1.5rem]"
                                style={{ animationDelay: '1s' }}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
