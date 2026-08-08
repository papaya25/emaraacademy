export default function Rosette({ color = "var(--gold)" }: { color?: string }) {
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <div className="rosette" aria-hidden="true">
      <svg viewBox="-11 -11 22 22">
        <g fill="none" stroke={color} strokeWidth="1.1">
          <circle r="2.2" />
          {petals.map((deg) => (
            <path
              key={deg}
              d="M0,-9 C2.5,-6.5 2.5,-4 0,-2.6 C-2.5,-4 -2.5,-6.5 0,-9Z"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
