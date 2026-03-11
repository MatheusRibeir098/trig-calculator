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
      <text x="${(x1 + x2) / 2}" y="${y1 + 25}" text-anchor="middle" 
            font-size="14" fill="#001F3F" font-weight="bold">
        Cateto Adjacente: ${adjacent.toFixed(2)}
      </text>
      
      <text x="${x2 + 30}" y="${(y2 + y3) / 2}" text-anchor="start" 
            font-size="14" fill="#001F3F" font-weight="bold">
        Cateto Oposto: ${opposite.toFixed(2)}
      </text>
      
      ${hypotenuse ? `
        <text x="${(x1 + x3) / 2 - 30}" y="${(y1 + y3) / 2 - 10}" text-anchor="middle" 
              font-size="14" fill="#8B5CF6" font-weight="bold">
          Hipotenusa: ${hypotenuse.toFixed(2)}
        </text>
      ` : ''}
      
      ${angle ? `
        <text x="${x1 + 20}" y="${y1 - 15}" text-anchor="start" 
              font-size="14" fill="#8B5CF6" font-weight="bold">
          θ = ${angle.toFixed(2)}°
        </text>
      ` : ''}
    `;
  }, [opposite, adjacent, hypotenuse, angle]);

  return (
    <div className="flex justify-center my-8">
      <svg
        ref={svgRef}
        width="100%"
        height="300"
        className="max-w-2xl border-2 border-purple rounded-lg bg-white"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
