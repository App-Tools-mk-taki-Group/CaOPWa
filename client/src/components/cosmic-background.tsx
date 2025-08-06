export default function CosmicBackground() {
  const particles = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    left: `${(i + 1) * 10}%`,
    animationDelay: `${i * 2}s`,
    animationDuration: `${15 + (i % 8)}s`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle animate-particle"
          style={{
            left: particle.left,
            animationDelay: particle.animationDelay,
            animationDuration: particle.animationDuration,
          }}
        />
      ))}
    </div>
  );
}
