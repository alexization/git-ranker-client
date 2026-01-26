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
    CHALLENGER: '#dc2626',
    MASTER: '#7c3aed',
    DIAMOND: '#0ea5e9',
    PLATINUM: '#06b6d4',
    GOLD: '#eab308',
    SILVER: '#64748b',
    BRONZE: '#ea580c',
    IRON: '#71717a',
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

    const accent = tierColors[user?.tier || ''] || '#6366f1'

    // User not found fallback
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
                    background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                }}>
                    <div style={{
                        display: 'flex',
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#a3a3a3',
                        letterSpacing: 4,
                    }}>
                        GIT RANKER
                    </div>
                    <div style={{
                        display: 'flex',
                        fontSize: 64,
                        fontWeight: 800,
                        color: '#171717',
                        marginTop: 24,
                    }}>
                        {username}
                    </div>
                    <div style={{
                        display: 'flex',
                        fontSize: 20,
                        color: '#a3a3a3',
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
        { label: 'Commits', value: user.commitCount },
        { label: 'PRs', value: user.prCount },
        { label: 'Merged', value: user.mergedPrCount },
        { label: 'Reviews', value: user.reviewCount },
        { label: 'Issues', value: user.issueCount },
    ]

    return new ImageResponse(
        (
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                position: 'relative',
            }}>
                {/* Top accent bar */}
                <div style={{
                    display: 'flex',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: accent,
                }} />

                {/* Main content */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '48px 64px',
                }}>
                    {/* Header row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}>
                        {/* User info */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 24,
                        }}>
                            <img
                                src={user.profileImage}
                                width={80}
                                height={80}
                                style={{
                                    borderRadius: 40,
                                    border: `4px solid ${accent}`,
                                }}
                            />
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 48,
                                    fontWeight: 800,
                                    color: '#171717',
                                    letterSpacing: -1,
                                }}>
                                    {user.username}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16,
                                    marginTop: 8,
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        fontSize: 18,
                                        fontWeight: 700,
                                        color: accent,
                                        letterSpacing: 2,
                                    }}>
                                        {user.tier}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        background: '#d4d4d4',
                                    }} />
                                    <div style={{
                                        display: 'flex',
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: '#737373',
                                    }}>
                                        Rank #{user.ranking?.toLocaleString()}
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        background: '#d4d4d4',
                                    }} />
                                    <div style={{
                                        display: 'flex',
                                        fontSize: 18,
                                        fontWeight: 600,
                                        color: '#737373',
                                    }}>
                                        Top {user.percentile?.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Git Ranker branding */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                        }}>
                            <div style={{
                                display: 'flex',
                                fontSize: 36,
                                fontWeight: 800,
                                color: '#171717',
                                letterSpacing: -0.5,
                            }}>
                                Git Ranker
                            </div>
                            <div style={{
                                display: 'flex',
                                fontSize: 16,
                                fontWeight: 500,
                                color: '#a3a3a3',
                                marginTop: 6,
                            }}>
                                git-ranker.com
                            </div>
                        </div>
                    </div>

                    {/* Stats section */}
                    <div style={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 20,
                        marginTop: 32,
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
                                    height: 180,
                                    background: '#fafafa',
                                    borderRadius: 20,
                                    border: '2px solid #f0f0f0',
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    fontSize: 56,
                                    fontWeight: 800,
                                    color: '#171717',
                                    letterSpacing: -2,
                                }}>
                                    {stat.value?.toLocaleString() || '0'}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: '#737373',
                                    marginTop: 12,
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        { ...size }
    )
}
