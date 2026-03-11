export function SpecialAnglesTable() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-navy mb-6">Ângulos Especiais</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-purple">
              <th className="text-left py-3 px-4 font-bold text-navy">Ângulo</th>
              <th className="text-center py-3 px-4 font-bold text-navy">sen(θ)</th>
              <th className="text-center py-3 px-4 font-bold text-navy">cos(θ)</th>
              <th className="text-center py-3 px-4 font-bold text-navy">tan(θ)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-purple/20 hover:bg-purple/5">
              <td className="py-3 px-4 font-semibold text-navy">30°</td>
              <td className="text-center py-3 px-4">1/2 = 0.5</td>
              <td className="text-center py-3 px-4">√3/2 ≈ 0.866</td>
              <td className="text-center py-3 px-4">√3/3 ≈ 0.577</td>
            </tr>
            <tr className="border-b border-purple/20 hover:bg-purple/5">
              <td className="py-3 px-4 font-semibold text-navy">45°</td>
              <td className="text-center py-3 px-4">√2/2 ≈ 0.707</td>
              <td className="text-center py-3 px-4">√2/2 ≈ 0.707</td>
              <td className="text-center py-3 px-4">1</td>
            </tr>
            <tr className="border-b border-purple/20 hover:bg-purple/5">
              <td className="py-3 px-4 font-semibold text-navy">60°</td>
              <td className="text-center py-3 px-4">√3/2 ≈ 0.866</td>
              <td className="text-center py-3 px-4">1/2 = 0.5</td>
              <td className="text-center py-3 px-4">√3 ≈ 1.732</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Visual representation */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 30-60-90 Triangle */}
        <div className="border-2 border-purple rounded-lg p-4">
          <h3 className="font-bold text-navy mb-3">Triângulo 30-60-90</h3>
          <svg viewBox="0 0 200 200" className="w-full h-auto">
            {/* Triangle */}
            <polygon points="20,180 180,180 180,40" fill="rgba(139, 92, 246, 0.1)" stroke="#8B5CF6" strokeWidth="2"/>
            {/* Right angle */}
            <rect x="170" y="170" width="10" height="10" fill="none" stroke="#001F3F" strokeWidth="1.5"/>
            {/* Labels */}
            <text x="100" y="195" textAnchor="middle" fontSize="12" fill="#001F3F" fontWeight="bold">1</text>
            <text x="195" y="110" textAnchor="start" fontSize="12" fill="#001F3F" fontWeight="bold">√3</text>
            <text x="90" y="100" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">2</text>
            <text x="30" y="160" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">30°</text>
            <text x="170" y="160" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">60°</text>
          </svg>
        </div>

        {/* 45-45-90 Triangle */}
        <div className="border-2 border-purple rounded-lg p-4">
          <h3 className="font-bold text-navy mb-3">Triângulo 45-45-90</h3>
          <svg viewBox="0 0 200 200" className="w-full h-auto">
            {/* Triangle */}
            <polygon points="20,180 180,180 180,20" fill="rgba(139, 92, 246, 0.1)" stroke="#8B5CF6" strokeWidth="2"/>
            {/* Right angle */}
            <rect x="170" y="170" width="10" height="10" fill="none" stroke="#001F3F" strokeWidth="1.5"/>
            {/* Labels */}
            <text x="100" y="195" textAnchor="middle" fontSize="12" fill="#001F3F" fontWeight="bold">1</text>
            <text x="195" y="100" textAnchor="start" fontSize="12" fill="#001F3F" fontWeight="bold">1</text>
            <text x="90" y="100" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">√2</text>
            <text x="30" y="160" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">45°</text>
            <text x="170" y="160" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">45°</text>
          </svg>
        </div>

        {/* 3-4-5 Triangle */}
        <div className="border-2 border-purple rounded-lg p-4">
          <h3 className="font-bold text-navy mb-3">Triângulo 3-4-5</h3>
          <svg viewBox="0 0 200 200" className="w-full h-auto">
            {/* Triangle */}
            <polygon points="20,180 140,180 140,60" fill="rgba(139, 92, 246, 0.1)" stroke="#8B5CF6" strokeWidth="2"/>
            {/* Right angle */}
            <rect x="130" y="170" width="10" height="10" fill="none" stroke="#001F3F" strokeWidth="1.5"/>
            {/* Labels */}
            <text x="80" y="195" textAnchor="middle" fontSize="12" fill="#001F3F" fontWeight="bold">4</text>
            <text x="155" y="120" textAnchor="start" fontSize="12" fill="#001F3F" fontWeight="bold">3</text>
            <text x="75" y="110" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">5</text>
            <text x="30" y="160" textAnchor="middle" fontSize="12" fill="#8B5CF6" fontWeight="bold">≈37°</text>
          </svg>
        </div>
      </div>

      <div className="mt-6 p-4 bg-purple/10 rounded-lg border-l-4 border-purple">
        <p className="text-sm text-navy">
          <strong>Dica:</strong> Estes são os ângulos mais comuns em trigonometria. 
          Use a tabela acima para verificar seus cálculos ou para aprender os valores exatos.
        </p>
      </div>
    </div>
  );
}
