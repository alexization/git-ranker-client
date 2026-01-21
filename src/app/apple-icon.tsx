import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 96,
                    background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 40,
                }}
            >
                <span
                    style={{
                        background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                        backgroundClip: "text",
                        color: "transparent",
                        fontWeight: 900,
                        fontFamily: "system-ui, sans-serif",
                    }}
                >
                    GR
                </span>
            </div>
        ),
        { ...size }
    )
}
