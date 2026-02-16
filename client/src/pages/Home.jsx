import React from 'react';

const Home = () => {
    return (
        <div>
            <h1>Welcome to SHUKTEERTH SHUDDHA</h1>
            <p>Empowering Women Self Help Groups via Digital Connection.</p>

            <div className="card">
                <h2>About the Platform</h2>
                <p>This platform connects local citizens with Self Help Groups (SHGs) providing essential services like Tailoring, Housekeeping, and more.</p>
            </div>

            <div className="card">
                <h2>Latest Updates</h2>
                <ul>
                    <li>New SHG Registration Open for 2026.</li>
                    <li>District Administration launches Digital Service Exchange.</li>
                </ul>
            </div>
        </div>
    );
};

export default Home;
