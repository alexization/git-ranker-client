import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Git Ranker Profile'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }: { params: { username: string } }) {
    const { username } = params

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const user = await fetch(`${apiUrl}/api/v1/users/${username}`).then((res) => res.json()).then(res => res.data || res.success)

    const tierColors: Record<string, string> = {
        CHALLENGER: '#EF4444',
        MASTER: '#9333EA',
        DIAMOND: '#3B82F6',
        PLATINUM: '#06B6D4',
        GOLD: '#EAB308',
        SILVER: '#94A3B8',
        BRONZE: '#EA580C',
        IRON: '#57534E',
    }

    const color = tierColors[user?.tier] || '#000000'

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0f172a',
                    backgroundImage: `linear-gradient(to bottom right, #0f172a, ${color}40)`,
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={user?.profileImage}
                        alt={username}
                        width={150}
                        height={150}
                        style={{ borderRadius: '50%', border: `8px solid ${color}` }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
                        <div style={{ fontSize: 60, fontWeight: 900 }}>{username}</div>
                        <div
                            style={{
                                fontSize: 40,
                                fontWeight: 700,
                                color: color,
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                padding: '4px 20px',
                                borderRadius: '50px',
                                marginTop: '10px',
                                textAlign: 'center',
                            }}
                        >
                            {user?.tier}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '40px', marginTop: '60px', color: '#cbd5e1' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: 30 }}>Total Score</div>
                        <div style={{ fontSize: 50, fontWeight: 900, color: 'white' }}>{user?.totalScore?.toLocaleString()}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: 30 }}>Global Rank</div>
                        <div style={{ fontSize: 50, fontWeight: 900, color: 'white' }}>#{user?.ranking}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ fontSize: 30 }}>Top Percent</div>
                        <div style={{ fontSize: 50, fontWeight: 900, color: 'white' }}>{user?.percentile?.toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}