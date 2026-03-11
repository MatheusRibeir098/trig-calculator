import { useRef, useEffect } from 'react';

interface TriangleCanvasProps {
  opposite?: number;
  adjacent?: number;
  hypotenuse?: number;
  angle?: number;
}

export function TriangleCanvas({
  opposite = 100,
  adjacent = 100,
  hypotenuse,
  angle,
}: TriangleCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const padding = 40;
    const maxWidth = svg.clientWidth - 2 * padding;
    const maxHeight = svg.clientHeight - 2 * padding;

    // Scale to fit
    const scale = Math.min(maxWidth / adjacent, maxHeight / opposite);
    const scaledAdj = adjacent * scale;
    const scaledOpp = opposite * scale;

    // Points
    const x1 = padding;
    const y1 = padding + scaledOpp;
    const x2 = padding + scaledAdj;
    const y2 = padding + scaledOpp;
    const x3 = padding + scaledAdj;
    const y3 = padding;

    // Clear and redraw
    svg.innerHTML = `
      <!-- Triangle -->
      <polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" 
               fill="rgba(139, 92, 246, 0.1)" 
               stroke="#8B5CF6" 
               stroke-width="2"/>
      
      <!-- Right angle indicator -->
      <rect x="${x2 - 10}" y="${y2 - 10}" width="10" height="10" 
            fill="none" stroke="#001F3F" stroke-width="1.5"/>
      
      <!-- Labels for sides -->
      <text x="${(x1 + x2) / 2}" y="${y1 + 20}" text-anchor="middle" 
            font-size="11" fill="#001F3F" font-weight="bold">
        Adj: ${adjacent.toFixed(1)}
      </text>
      
      <text x="${x2 + 15}" y="${(y2 + y3) / 2}" text-anchor="start" 
            font-size="11" fill="#001F3F" font-weight="bold">
        Opo: ${opposite.toFixed(1)}
      </text>
      
      ${hypotenuse ? `
        <text x="${(x1 + x3) / 2 - 20}" y="${(y1 + y3) / 2 - 5}" text-anchor="middle" 
              font-size="11" fill="#8B5CF6" font-weight="bold">
          Hip: ${hypotenuse.toFixed(1)}
        </text>
      ` : ''}
      
      ${angle ? `
        <text x="${x1 + 15}" y="${y1 - 10}" text-anchor="start" 
              font-size="11" fill="#8B5CF6" font-weight="bold">
          θ=${angle.toFixed(1)}°
        </text>
      ` : ''}
    `;
  }, [opposite, adjacent, hypotenuse, angle]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      margin: '1rem 0',
      width: '100%'
    }}>
      <svg
        ref={svgRef}
        width="100%"
        height="250"
        style={{
          maxWidth: '100%',
          border: '2px solid #a855f7',
          borderRadius: '0.5rem',
          background: 'white'
        }}
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
