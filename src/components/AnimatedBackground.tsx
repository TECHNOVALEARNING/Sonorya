import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <div className="sonorya-animated-bg" aria-hidden="true">
      {/* Dynamic Ambient Gradient Orbs */}
      <div className="aura-orb orb-teal" />
      <div className="aura-orb orb-gold" />
      <div className="aura-orb orb-coral" />
      <div className="aura-orb orb-indigo" />

      {/* Subtle Soundwave Line Overlay */}
      <div className="soundwave-mesh" />

      {/* Floating Audio Particles */}
      <div className="particles-container">
        {[...Array(14)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`} />
        ))}
      </div>
    </div>
  );
};
