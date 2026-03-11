/**
 * Trigonometry calculation library
 */

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export interface TriangleData {
  angle?: number; // in degrees
  opposite?: number;
  adjacent?: number;
  hypotenuse?: number;
  sin?: number;
  cos?: number;
  tan?: number;
  cot?: number;
  sec?: number;
  csc?: number;
}

export interface CalculationResult extends TriangleData {
  angleInRadians?: number;
}

export function degreesToRadians(degrees: number): number {
  return degrees * DEG_TO_RAD;
}

export function radiansToDegrees(radians: number): number {
  return radians * RAD_TO_DEG;
}

export function calculateTriangle(input: {
  angle?: number;
  opposite?: number;
  adjacent?: number;
  hypotenuse?: number;
}): CalculationResult {
  const { angle, opposite, adjacent, hypotenuse } = input;
  const result: CalculationResult = {};
  
  // Count provided values
  const providedCount = [angle, opposite, adjacent, hypotenuse].filter(v => v !== undefined).length;
  
  if (providedCount < 2) {
    throw new Error('Forneça pelo menos 2 valores para calcular');
  }

  // Case 1: angle + adjacent
  if (angle !== undefined && adjacent !== undefined && opposite === undefined && hypotenuse === undefined) {
    const angleRad = degreesToRadians(angle);
    result.angle = angle;
    result.adjacent = adjacent;
    result.opposite = adjacent * Math.tan(angleRad);
    result.hypotenuse = adjacent / Math.cos(angleRad);
  }
  // Case 2: angle + opposite
  else if (angle !== undefined && opposite !== undefined && adjacent === undefined && hypotenuse === undefined) {
    const angleRad = degreesToRadians(angle);
    result.angle = angle;
    result.opposite = opposite;
    result.adjacent = opposite / Math.tan(angleRad);
    result.hypotenuse = opposite / Math.sin(angleRad);
  }
  // Case 3: angle + hypotenuse
  else if (angle !== undefined && hypotenuse !== undefined && opposite === undefined && adjacent === undefined) {
    const angleRad = degreesToRadians(angle);
    result.angle = angle;
    result.hypotenuse = hypotenuse;
    result.opposite = hypotenuse * Math.sin(angleRad);
    result.adjacent = hypotenuse * Math.cos(angleRad);
  }
  // Case 4: opposite + adjacent
  else if (opposite !== undefined && adjacent !== undefined && angle === undefined && hypotenuse === undefined) {
    result.opposite = opposite;
    result.adjacent = adjacent;
    result.hypotenuse = Math.sqrt(opposite ** 2 + adjacent ** 2);
    result.angle = radiansToDegrees(Math.atan(opposite / adjacent));
  }
  // Case 5: opposite + hypotenuse
  else if (opposite !== undefined && hypotenuse !== undefined && adjacent === undefined && angle === undefined) {
    result.opposite = opposite;
    result.hypotenuse = hypotenuse;
    result.adjacent = Math.sqrt(hypotenuse ** 2 - opposite ** 2);
    result.angle = radiansToDegrees(Math.asin(opposite / hypotenuse));
  }
  // Case 6: adjacent + hypotenuse
  else if (adjacent !== undefined && hypotenuse !== undefined && opposite === undefined && angle === undefined) {
    result.adjacent = adjacent;
    result.hypotenuse = hypotenuse;
    result.opposite = Math.sqrt(hypotenuse ** 2 - adjacent ** 2);
    result.angle = radiansToDegrees(Math.acos(adjacent / hypotenuse));
  }
  // Case 7+: 3 or 4 values provided → validate
  else if (providedCount >= 3) {
    result.angle = angle;
    result.opposite = opposite;
    result.adjacent = adjacent;
    result.hypotenuse = hypotenuse;
    
    // Fill missing value
    if (angle === undefined) {
      result.angle = radiansToDegrees(Math.atan(opposite! / adjacent!));
    } else if (opposite === undefined) {
      result.opposite = adjacent! * Math.tan(degreesToRadians(angle));
    } else if (adjacent === undefined) {
      result.adjacent = opposite! / Math.tan(degreesToRadians(angle));
    } else if (hypotenuse === undefined) {
      result.hypotenuse = Math.sqrt(opposite! ** 2 + adjacent! ** 2);
    }
  } else {
    throw new Error('Combinação inválida de valores');
  }

  // Calculate trigonometric ratios
  if (result.hypotenuse && result.opposite && result.adjacent) {
    result.sin = result.opposite / result.hypotenuse;
    result.cos = result.adjacent / result.hypotenuse;
    result.tan = result.opposite / result.adjacent;
    result.cot = result.adjacent / result.opposite;
    result.sec = result.hypotenuse / result.adjacent;
    result.csc = result.hypotenuse / result.opposite;
    result.angleInRadians = degreesToRadians(result.angle!);
  }

  return result;
}

export function formatNumber(value: number, decimals: number = 4): string {
  if (!isFinite(value)) {
    return 'Infinito';
  }
  return value.toFixed(decimals);
}

export function validateInput(value: string | number | undefined): number | null {
  if (value === undefined || value === '') return null;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num) || !isFinite(num)) return null;
  return num;
}

export function validateAngle(angle: number): { valid: boolean; error?: string } {
  if (angle <= 0 || angle >= 90) {
    return { valid: false, error: 'Ângulo deve estar entre 0° e 90°' };
  }
  return { valid: true };
}

export function validateSide(value: number, name: string): { valid: boolean; error?: string } {
  if (value <= 0) {
    return { valid: false, error: `${name} deve ser positivo` };
  }
  return { valid: true };
}
