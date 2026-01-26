import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Git Ranker Profile'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface UserData {
    username: string
    tier: string
    totalScore: number
    ranking: number
    percentile: number
    profileImage: string
    commitCount: number
    prCount: number
    issueCount: number
    reviewCount: number
    mergedPrCount: number
}

const tierColors: Record<string, string> = {
    CHALLENGER: '#ff3b5c',
    MASTER: '#b06aff',
    DIAMOND: '#00d4ff',
    PLATINUM: '#00e8c6',
    GOLD: '#ffc93c',
    SILVER: '#c0c7d0',
    BRONZE: '#ff8c42',
    IRON: '#8b9298',
}

export default async function Image({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.git-ranker.com'

    let user: UserData | null = null

    try {
        const response = await fetch(`${apiUrl}/api/v1/users/${username}`, {
            next: { revalidate: 3600 }
        })
        if (response.ok) {
            const data = await response.json()
            user = data.data || data.success
        }
    } catch {
        // Fall back to default
    }

    const accent = tierColors[user?.tier || ''] || '#8b5cf6'

    if (!user) {
        return new ImageResponse(
            (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#000',
                }}>
                    <div style={{
                        display: 'flex',
                        fontSize: 28,
                        fontWeight: 600,
                        color: '#404040',
                        letterSpacing: 3,
                    }}>
                        GIT RANKER
                    </div>
                    <div style={{
                        display: 'flex',
                        fontSize: 56,
                        fontWeight: 700,
                        color: '#fff',
                        marginTop: 20,
                    }}>
                        {username}
                    </div>
                    <div style={{
                        display: 'flex',
                        fontSize: 18,
                        color: '#525252',
                        marginTop: 16,
                    }}>
                        User not found
                    </div>
                </div>
            ),
            { ...size }
        )
    }

    const stats = [
        { label: 'COMMITS', value: user.commitCount },
        { label: 'PRS', value: user.prCount },
        { label: 'MERGED', value: user.mergedPrCount },
        { label: 'REVIEWS', value: user.reviewCount },
        { label: 'ISSUES', value: user.issueCount },
    ]

    return new ImageResponse(
        (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#000',
                padding: '60px 70px',
            }}>
                {/* Top bar */}
                <div style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: accent,
                }} />

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 20,
                    }}>
                        <img
                            src={user.profileImage}
                            width={72}
                            height={72}
                            style={{
                                borderRadius: 36,
                                border: `3px solid ${accent}`,
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <div style={{
                                display: 'flex',
                                fontSize: 44,
                                fontWeight: 700,
                                color: '#fff',
                                letterSpacing: -1,
                            }}>
                                {user.username}
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                marginTop: 4,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 16,
                                    fontWeight: 700,
                                    color: accent,
                                    letterSpacing: 2,
                                }}>
                                    {user.tier}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 16,
                                    color: '#525252',
                                }}>
                                    •
                                </div>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 16,
                                    color: '#737373',
                                }}>
                                    Rank #{user.ranking?.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#404040',
                        letterSpacing: 2,
                    }}>
                        GIT RANKER
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    marginTop: 20,
                }}>
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1,
                                height: 200,
                                background: '#0a0a0a',
                                borderRadius: 16,
                                border: '1px solid #1a1a1a',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                fontSize: 52,
                                fontWeight: 700,
                                color: '#fff',
                                letterSpacing: -1,
                            }}>
                                {stat.value?.toLocaleString() || '0'}
                            </div>
                            <div style={{
                                display: 'flex',
                                fontSize: 13,
                                fontWeight: 600,
                                color: '#525252',
                                letterSpacing: 2,
                                marginTop: 12,
                            }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20,
                }}>
                    <div style={{
                        display: 'flex',
                        fontSize: 15,
                        color: '#404040',
                    }}>
                        git-ranker.com
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                    }}>
                        <div style={{
                            display: 'flex',
                            fontSize: 15,
                            color: '#525252',
                        }}>
                            Top
                        </div>
                        <div style={{
                            display: 'flex',
                            fontSize: 18,
                            fontWeight: 700,
                            color: accent,
                        }}>
                            {user.percentile?.toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    )
}
