import React from 'react';

const About = () => {
    return (
        <div className="container" style={{ paddingTop: '40px' }}>
            <div className="card" style={{
                padding: '40px',
                maxWidth: '800px',
                margin: '0 auto',
                animation: 'fadeInUp 0.8s ease-out'
            }}>
                <h1 style={{
                    color: 'var(--gov-blue)',
                    marginBottom: '30px',
                    borderBottom: '2px solid #eee',
                    paddingBottom: '15px',
                    textAlign: 'center'
                }}>
                    Our Mission: Bridging the Gap
                </h1>

                <div style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.8',
                    color: 'var(--gov-text)',
                    textAlign: 'justify',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <p>
                        In the world of modern commerce, we often talk about innovation. But sometimes, true innovation is simply connecting the dots that already exist.
                    </p>

                    <p>
                        Recently, we discovered the incredible work of local women-led Self-Help Groups (SHGs). These women possess immense potential and produce artisanal quality that rivals high-end brands. However, they face a critical barrier: <strong>Market Access</strong>.
                    </p>

                    <p>
                        We realized that sympathy doesn't scale markets—strategy does. That is why we have decided to step in, not as a savior, but as a bridge. Our mission is to build a robust supply chain that takes their local genius and gives it a global (or national) audience.
                    </p>

                    <p>
                        This venture is about leveling the playing field. It is about proving that when given a fair opportunity and the right infrastructure, rural entrepreneurship can thrive.
                    </p>

                    <p style={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem',
                        color: 'var(--gov-blue)',
                        textAlign: 'center',
                        marginTop: '20px',
                        fontStyle: 'italic'
                    }}>
                        "We are moving from aid to trade."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
