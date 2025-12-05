import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'FilePilot - Free Online File Converter'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
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
                    backgroundColor: '#0f172a', // slate-900
                    backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                }}
            >
                {/* Background Gradients */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '20%',
                        height: '400px',
                        width: '400px',
                        background: 'linear-gradient(to right, #4f46e5, #ec4899)', // indigo to pink
                        filter: 'blur(100px)',
                        opacity: 0.3,
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '20%',
                        height: '400px',
                        width: '400px',
                        background: 'linear-gradient(to right, #06b6d4, #3b82f6)', // cyan to blue
                        filter: 'blur(100px)',
                        opacity: 0.3,
                        borderRadius: '50%',
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '32px',
                        padding: '60px 80px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {/* Logo Icon */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
                            borderRadius: '24px',
                            width: '80px',
                            height: '80px',
                            marginBottom: '24px',
                            boxShadow: '0 0 30px rgba(79, 70, 229, 0.4)',
                        }}
                    >
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <path d="M12 18v-6" />
                            <path d="M9 15l3 3 3-3" />
                        </svg>
                    </div>

                    {/* Title */}
                    <div
                        style={{
                            fontSize: '84px',
                            fontWeight: 800,
                            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            letterSpacing: '-2px',
                            marginBottom: '16px',
                        }}
                    >
                        FilePilot
                    </div>

                    {/* Tagline */}
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#94a3b8',
                            textAlign: 'center',
                            maxWidth: '600px',
                            lineHeight: 1.4,
                        }}
                    >
                        The Ultimate File Conversion Suite
                    </div>

                    {/* Features Badge */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '16px',
                            marginTop: '40px',
                        }}
                    >
                        {['Free', 'Secure', 'Unlimited'].map((item) => (
                            <div
                                key={item}
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '100px',
                                    color: '#e2e8f0',
                                    fontSize: '20px',
                                    fontWeight: 500,
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                }}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
