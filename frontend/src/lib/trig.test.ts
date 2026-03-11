import { describe, it, expect } from 'vitest';
import {
  calculateTriangle,
  degreesToRadians,
  radiansToDegrees,
  validateAngle,
  validateSide,
  formatNumber,
} from './trig';

describe('Trigonometry Library', () => {
  describe('Angle Conversion', () => {
    it('should convert degrees to radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 5);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 5);
      expect(degreesToRadians(45)).toBeCloseTo(Math.PI / 4, 5);
    });

    it('should convert radians to degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 5);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 5);
      expect(radiansToDegrees(Math.PI / 4)).toBeCloseTo(45, 5);
    });
  });

  describe('Triangle Calculation', () => {
    it('should calculate with angle + adjacent', () => {
      const result = calculateTriangle({ angle: 45, adjacent: 1 });
      expect(result.angle).toBe(45);
      expect(result.adjacent).toBe(1);
      expect(result.opposite).toBeCloseTo(1, 5);
      expect(result.hypotenuse).toBeCloseTo(Math.sqrt(2), 5);
    });

    it('should calculate with angle + opposite', () => {
      const result = calculateTriangle({ angle: 45, opposite: 1 });
      expect(result.angle).toBe(45);
      expect(result.opposite).toBe(1);
      expect(result.adjacent).toBeCloseTo(1, 5);
      expect(result.hypotenuse).toBeCloseTo(Math.sqrt(2), 5);
    });

    it('should calculate with angle + hypotenuse', () => {
      const result = calculateTriangle({ angle: 45, hypotenuse: Math.sqrt(2) });
      expect(result.angle).toBe(45);
      expect(result.hypotenuse).toBeCloseTo(Math.sqrt(2), 5);
      expect(result.opposite).toBeCloseTo(1, 5);
      expect(result.adjacent).toBeCloseTo(1, 5);
    });

    it('should calculate with opposite + adjacent (3-4-5 triangle)', () => {
      const result = calculateTriangle({ opposite: 3, adjacent: 4 });
      expect(result.opposite).toBe(3);
      expect(result.adjacent).toBe(4);
      expect(result.hypotenuse).toBeCloseTo(5, 5);
      expect(result.angle).toBeCloseTo(36.86989764584402, 5);
    });

    it('should calculate with opposite + hypotenuse', () => {
      const result = calculateTriangle({ opposite: 3, hypotenuse: 5 });
      expect(result.opposite).toBe(3);
      expect(result.hypotenuse).toBe(5);
      expect(result.adjacent).toBeCloseTo(4, 5);
    });

    it('should calculate with adjacent + hypotenuse', () => {
      const result = calculateTriangle({ adjacent: 4, hypotenuse: 5 });
      expect(result.adjacent).toBe(4);
      expect(result.hypotenuse).toBe(5);
      expect(result.opposite).toBeCloseTo(3, 5);
    });

    it('should calculate trigonometric ratios', () => {
      const result = calculateTriangle({ opposite: 3, adjacent: 4 });
      expect(result.sin).toBeCloseTo(0.6, 5);
      expect(result.cos).toBeCloseTo(0.8, 5);
      expect(result.tan).toBeCloseTo(0.75, 5);
      expect(result.cot).toBeCloseTo(1.333333, 5);
      expect(result.sec).toBeCloseTo(1.25, 5);
      expect(result.csc).toBeCloseTo(1.666666, 5);
    });

    it('should throw error with insufficient data', () => {
      expect(() => {
        calculateTriangle({ angle: 45 });
      }).toThrow();
    });
  });

  describe('Validation', () => {
    it('should validate angle range', () => {
      expect(validateAngle(45).valid).toBe(true);
      expect(validateAngle(0).valid).toBe(false);
      expect(validateAngle(90).valid).toBe(false);
      expect(validateAngle(-10).valid).toBe(false);
      expect(validateAngle(100).valid).toBe(false);
    });

    it('should validate positive sides', () => {
      expect(validateSide(10, 'Test').valid).toBe(true);
      expect(validateSide(0, 'Test').valid).toBe(false);
      expect(validateSide(-5, 'Test').valid).toBe(false);
    });
  });

  describe('Formatting', () => {
    it('should format numbers with decimals', () => {
      expect(formatNumber(3.14159, 2)).toBe('3.14');
      expect(formatNumber(3.14159, 4)).toBe('3.1416');
      expect(formatNumber(100, 0)).toBe('100');
    });

    it('should handle infinity', () => {
      expect(formatNumber(Infinity, 2)).toBe('Infinito');
      expect(formatNumber(-Infinity, 2)).toBe('Infinito');
    });
  });
});
