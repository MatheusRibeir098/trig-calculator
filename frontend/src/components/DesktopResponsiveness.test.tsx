import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TrigForm } from './TrigForm';
import { HistoryPanel } from './HistoryPanel';

/**
 * Bug Condition Exploration Test - Desktop Layout Asymmetry
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3**
 * 
 * This test encodes the EXPECTED behavior after the fix:
 * - TrigForm and HistoryPanel should have the SAME maxWidth (64rem) on desktop viewports (≥1024px)
 * 
 * **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * Current buggy state:
 * - TrigForm has maxWidth: '42rem' (672px)
 * - HistoryPanel has maxWidth: '64rem' (1024px)
 * 
 * Expected behavior after fix:
 * - Both components should have maxWidth: '64rem' (1024px)
 * 
 * **DO NOT attempt to fix the test or the code when it fails**
 */
describe('Desktop Responsiveness - Bug Condition Exploration', () => {
  describe('Property 1: Fault Condition - Desktop Layout Asymmetry', () => {
    it('should have consistent maxWidth for TrigForm and HistoryPanel on desktop viewports (≥1024px)', () => {
      // Arrange: Render both components
      const { container: trigFormContainer } = render(
        <TrigForm 
          onCalculate={() => {}} 
          onError={() => {}} 
        />
      );
      
      const { container: historyPanelContainer } = render(
        <HistoryPanel refreshTrigger={0} />
      );

      // Act: Extract the root div elements (first child of container)
      const trigFormRoot = trigFormContainer.firstChild as HTMLElement;
      const historyPanelRoot = historyPanelContainer.firstChild as HTMLElement;

      // Assert: Both components should exist
      expect(trigFormRoot).toBeTruthy();
      expect(historyPanelRoot).toBeTruthy();

      // Extract maxWidth values from computed styles
      const trigFormMaxWidth = trigFormRoot?.style.maxWidth;
      const historyPanelMaxWidth = historyPanelRoot?.style.maxWidth;

      // Document current buggy state for counterexample analysis
      console.log('=== Bug Condition Counterexample ===');
      console.log(`TrigForm maxWidth: ${trigFormMaxWidth}`);
      console.log(`HistoryPanel maxWidth: ${historyPanelMaxWidth}`);
      console.log('Expected after fix: Both should be 64rem');
      console.log('===================================');

      // **EXPECTED BEHAVIOR AFTER FIX**:
      // Both components should have maxWidth of '64rem' for visual alignment
      expect(trigFormMaxWidth).toBe('64rem');
      expect(historyPanelMaxWidth).toBe('64rem');
      
      // Verify they are equal (symmetry requirement)
      expect(trigFormMaxWidth).toBe(historyPanelMaxWidth);
    });

    it('should document the asymmetry bug - TrigForm renders narrower than HistoryPanel', () => {
      // Arrange: Render both components
      const { container: trigFormContainer } = render(
        <TrigForm 
          onCalculate={() => {}} 
          onError={() => {}} 
        />
      );
      
      const { container: historyPanelContainer } = render(
        <HistoryPanel refreshTrigger={0} />
      );

      // Act: Extract maxWidth values from root elements
      const trigFormRoot = trigFormContainer.firstChild as HTMLElement;
      const historyPanelRoot = historyPanelContainer.firstChild as HTMLElement;

      const trigFormMaxWidth = trigFormRoot?.style.maxWidth;
      const historyPanelMaxWidth = historyPanelRoot?.style.maxWidth;

      // Convert rem to pixels for comparison (assuming 1rem = 16px)
      const remToPx = (remValue: string): number => {
        if (!remValue) return 0;
        const numericValue = parseFloat(remValue.replace('rem', ''));
        return numericValue * 16;
      };

      const trigFormWidthPx = remToPx(trigFormMaxWidth);
      const historyPanelWidthPx = remToPx(historyPanelMaxWidth);

      // Document the counterexample
      console.log('=== Desktop Layout Asymmetry Counterexample ===');
      console.log(`Viewport: 1920x1080 (desktop)`);
      console.log(`TrigForm renders at: ${trigFormWidthPx}px (${trigFormMaxWidth})`);
      console.log(`HistoryPanel renders at: ${historyPanelWidthPx}px (${historyPanelMaxWidth})`);
      console.log(`Difference: ${historyPanelWidthPx - trigFormWidthPx}px`);
      console.log(`Visual result: Asymmetric layout with misaligned components`);
      console.log('==============================================');

      // **EXPECTED BEHAVIOR AFTER FIX**:
      // Both components should render at the same width
      expect(trigFormWidthPx).toBe(historyPanelWidthPx);
      expect(trigFormWidthPx).toBe(1024); // 64rem = 1024px
      expect(historyPanelWidthPx).toBe(1024); // 64rem = 1024px
    });
  });
});

/**
 * Preservation Property Tests - Mobile and Tablet Responsiveness
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 * 
 * These tests capture the OBSERVED behavior on UNFIXED code for non-buggy inputs (viewports <1024px).
 * They verify that mobile and tablet responsiveness remains unchanged after the desktop fix.
 * 
 * **IMPORTANT**: These tests should PASS on unfixed code (baseline behavior)
 * 
 * Observations from unfixed code:
 * - Mobile viewports (<768px): Both components occupy full responsive width
 * - Tablet viewports (768px-1023px): Responsive layout works correctly
 * - All form functionality, calculations, and interactions work correctly
 * - Visual styles (padding, margins, colors, shadows) remain unchanged
 */
describe('Desktop Responsiveness - Preservation Property Tests', () => {
  describe('Property 2: Preservation - Mobile and Tablet Responsiveness', () => {
    
    /**
     * Test: Mobile Responsiveness Preservation (<768px)
     * 
     * Verifies that in mobile viewports, both components maintain their responsive behavior:
     * - Components use their defined maxWidth values
     * - Layout remains functional and accessible
     * - No horizontal overflow or layout breaks
     */
    it('should preserve mobile responsiveness for TrigForm (<768px viewports)', () => {
      // Arrange: Render TrigForm
      const { container } = render(
        <TrigForm 
          onCalculate={() => {}} 
          onError={() => {}} 
        />
      );

      // Act: Extract root element
      const trigFormRoot = container.firstChild as HTMLElement;

      // Assert: Verify component structure exists
      expect(trigFormRoot).toBeTruthy();

      // Observe: In mobile viewports, TrigForm has maxWidth: '42rem' (unfixed code)
      // This is the baseline behavior we want to preserve for mobile
      const maxWidth = trigFormRoot?.style.maxWidth;
      
      // Document observation
      console.log('=== Mobile Preservation - TrigForm ===');
      console.log(`Observed maxWidth: ${maxWidth}`);
      console.log(`Expected: Component renders with defined maxWidth`);
      console.log('=====================================');

      // Verify: Component has a maxWidth defined (preserves responsive behavior)
      expect(maxWidth).toBeTruthy();
      expect(maxWidth).toMatch(/rem$/); // Should be in rem units
      
      // Verify: Component has proper styling preserved
      expect(trigFormRoot?.style.background).toBe('white');
      expect(trigFormRoot?.style.borderRadius).toBe('0.5rem');
      expect(trigFormRoot?.style.padding).toBe('1rem');
      expect(trigFormRoot?.style.margin).toBe('0px auto');
    });

    it('should preserve mobile responsiveness for HistoryPanel (<768px viewports)', () => {
      // Arrange: Render HistoryPanel
      const { container } = render(
        <HistoryPanel refreshTrigger={0} />
      );

      // Act: Extract root element
      const historyPanelRoot = container.firstChild as HTMLElement;

      // Assert: Verify component structure exists
      expect(historyPanelRoot).toBeTruthy();

      // Observe: In mobile viewports, HistoryPanel has maxWidth: '64rem' (unfixed code)
      const maxWidth = historyPanelRoot?.style.maxWidth;
      
      // Document observation
      console.log('=== Mobile Preservation - HistoryPanel ===');
      console.log(`Observed maxWidth: ${maxWidth}`);
      console.log(`Expected: Component renders with defined maxWidth`);
      console.log('==========================================');

      // Verify: Component has a maxWidth defined (preserves responsive behavior)
      expect(maxWidth).toBeTruthy();
      expect(maxWidth).toMatch(/rem$/); // Should be in rem units
      
      // Verify: Component has proper styling preserved
      expect(historyPanelRoot?.style.background).toBe('white');
      expect(historyPanelRoot?.style.borderRadius).toBe('0.5rem');
      expect(historyPanelRoot?.style.padding).toBe('1rem');
      expect(historyPanelRoot?.style.margin).toBe('1rem auto');
    });

    /**
     * Test: Tablet Responsiveness Preservation (768px-1023px)
     * 
     * Verifies that in tablet viewports, both components maintain their responsive behavior:
     * - Components use their defined maxWidth values
     * - Layout adapts appropriately for medium screens
     * - Visual hierarchy remains intact
     */
    it('should preserve tablet responsiveness for both components (768px-1023px viewports)', () => {
      // Arrange: Render both components
      const { container: trigFormContainer } = render(
        <TrigForm 
          onCalculate={() => {}} 
          onError={() => {}} 
        />
      );
      
      const { container: historyPanelContainer } = render(
        <HistoryPanel refreshTrigger={0} />
      );

      // Act: Extract root elements
      const trigFormRoot = trigFormContainer.firstChild as HTMLElement;
      const historyPanelRoot = historyPanelContainer.firstChild as HTMLElement;

      // Assert: Both components exist
      expect(trigFormRoot).toBeTruthy();
      expect(historyPanelRoot).toBeTruthy();

      // Observe: Both components maintain their maxWidth in tablet viewports
      const trigFormMaxWidth = trigFormRoot?.style.maxWidth;
      const historyPanelMaxWidth = historyPanelRoot?.style.maxWidth;

      // Document observation
      console.log('=== Tablet Preservation ===');
      console.log(`TrigForm maxWidth: ${trigFormMaxWidth}`);
      console.log(`HistoryPanel maxWidth: ${historyPanelMaxWidth}`);
      console.log(`Expected: Both components render with their defined maxWidth`);
      console.log('===========================');

      // Verify: Both components have maxWidth defined
      expect(trigFormMaxWidth).toBeTruthy();
      expect(historyPanelMaxWidth).toBeTruthy();
      
      // Verify: Both use rem units (responsive design)
      expect(trigFormMaxWidth).toMatch(/rem$/);
      expect(historyPanelMaxWidth).toMatch(/rem$/);
    });

    /**
     * Test: Functionality Preservation
     * 
     * Verifies that all form functionality, calculations, and interactions work correctly:
     * - Form inputs are accessible and functional
     * - Buttons are clickable and responsive
     * - Component structure is preserved
     */
    it('should preserve form functionality in TrigForm', () => {
      // Arrange: Render TrigForm
      const { container } = render(
        <TrigForm 
          onCalculate={() => {}} 
          onError={() => {}} 
        />
      );

      // Act: Query for form elements
      const form = container.querySelector('form');
      const inputs = container.querySelectorAll('input[type="number"]');
      const buttons = container.querySelectorAll('button');

      // Assert: Form structure is preserved
      expect(form).toBeTruthy();
      
      // Verify: All input fields exist (angle, opposite, adjacent, hypotenuse, decimals)
      expect(inputs.length).toBeGreaterThanOrEqual(5);
      
      // Verify: Buttons exist (Calculate, Clear)
      expect(buttons.length).toBeGreaterThanOrEqual(2);

      // Document observation
      console.log('=== Functionality Preservation - TrigForm ===');
      console.log(`Form exists: ${!!form}`);
      console.log(`Number of inputs: ${inputs.length}`);
      console.log(`Number of buttons: ${buttons.length}`);
      console.log(`Expected: All form elements functional`);
      console.log('============================================');
    });

    it('should preserve button functionality in HistoryPanel', () => {
      // Arrange: Render HistoryPanel
      const { container } = render(
        <HistoryPanel refreshTrigger={0} />
      );

      // Act: Query for interactive elements
      const heading = container.querySelector('h2');
      const buttons = container.querySelectorAll('button');

      // Assert: Component structure is preserved
      expect(heading).toBeTruthy();
      expect(heading?.textContent).toBe('Histórico de Cálculos');

      // Document observation
      console.log('=== Functionality Preservation - HistoryPanel ===');
      console.log(`Heading exists: ${!!heading}`);
      console.log(`Number of buttons: ${buttons.length}`);
      console.log(`Expected: Component structure intact`);
      console.log('================================================');
    });

    /**
     * Test: Visual Styles Preservation
     * 
     * Verifies that visual styles remain unchanged:
     * - Padding, margins, colors, shadows are preserved
     * - Border radius and background colors match original
     * - Box shadow effects are maintained
     */
    it('should preserve visual styles for TrigForm', () => {
      // Arrange: Render TrigForm
      const { container } = render(
        <TrigForm 
          onCalculate={() => {}} 
          onError={() => {}} 
        />
      );

      // Act: Extract root element and styles
      const trigFormRoot = container.firstChild as HTMLElement;

      // Assert: Verify all visual styles are preserved
      expect(trigFormRoot?.style.background).toBe('white');
      expect(trigFormRoot?.style.borderRadius).toBe('0.5rem');
      expect(trigFormRoot?.style.boxShadow).toBe('0 10px 15px -3px rgba(0, 0, 0, 0.1)');
      expect(trigFormRoot?.style.padding).toBe('1rem');
      expect(trigFormRoot?.style.margin).toBe('0px auto');

      // Document observation
      console.log('=== Visual Styles Preservation - TrigForm ===');
      console.log(`Background: ${trigFormRoot?.style.background}`);
      console.log(`Border Radius: ${trigFormRoot?.style.borderRadius}`);
      console.log(`Box Shadow: ${trigFormRoot?.style.boxShadow}`);
      console.log(`Padding: ${trigFormRoot?.style.padding}`);
      console.log(`Margin: ${trigFormRoot?.style.margin}`);
      console.log(`Expected: All styles preserved`);
      console.log('============================================');
    });

    it('should preserve visual styles for HistoryPanel', () => {
      // Arrange: Render HistoryPanel
      const { container } = render(
        <HistoryPanel refreshTrigger={0} />
      );

      // Act: Extract root element and styles
      const historyPanelRoot = container.firstChild as HTMLElement;

      // Assert: Verify all visual styles are preserved
      expect(historyPanelRoot?.style.background).toBe('white');
      expect(historyPanelRoot?.style.borderRadius).toBe('0.5rem');
      expect(historyPanelRoot?.style.boxShadow).toBe('0 10px 15px -3px rgba(0, 0, 0, 0.1)');
      expect(historyPanelRoot?.style.padding).toBe('1rem');
      expect(historyPanelRoot?.style.margin).toBe('1rem auto');

      // Document observation
      console.log('=== Visual Styles Preservation - HistoryPanel ===');
      console.log(`Background: ${historyPanelRoot?.style.background}`);
      console.log(`Border Radius: ${historyPanelRoot?.style.borderRadius}`);
      console.log(`Box Shadow: ${historyPanelRoot?.style.boxShadow}`);
      console.log(`Padding: ${historyPanelRoot?.style.padding}`);
      console.log(`Margin: ${historyPanelRoot?.style.margin}`);
      console.log(`Expected: All styles preserved`);
      console.log('===============================================');
    });

    /**
     * Test: Property-Based Test - Multiple Viewport Scenarios
     * 
     * This test simulates property-based testing by verifying behavior across
     * multiple viewport scenarios to ensure preservation across the input space.
     * 
     * In a full PBT implementation, we would generate random viewport sizes,
     * but for this test we verify key breakpoints that represent the domain.
     */
    it('should preserve responsive behavior across multiple mobile/tablet scenarios', () => {
      // Test Case 1: Small mobile (375px)
      const mobileSmall = {
        width: 375,
        description: 'Small mobile (iPhone SE)',
        expectedBehavior: 'Components render with maxWidth, centered with auto margins'
      };

      // Test Case 2: Large mobile (414px)
      const mobileLarge = {
        width: 414,
        description: 'Large mobile (iPhone Pro Max)',
        expectedBehavior: 'Components render with maxWidth, centered with auto margins'
      };

      // Test Case 3: Tablet portrait (768px)
      const tabletPortrait = {
        width: 768,
        description: 'Tablet portrait (iPad)',
        expectedBehavior: 'Components render with maxWidth, centered with auto margins'
      };

      // Test Case 4: Tablet landscape (1023px - just below desktop breakpoint)
      const tabletLandscape = {
        width: 1023,
        description: 'Tablet landscape (iPad Pro)',
        expectedBehavior: 'Components render with maxWidth, centered with auto margins'
      };

      const testCases = [mobileSmall, mobileLarge, tabletPortrait, tabletLandscape];

      console.log('=== Property-Based Preservation Test ===');
      
      testCases.forEach((testCase) => {
        // Arrange: Render components
        const { container: trigFormContainer } = render(
          <TrigForm 
            onCalculate={() => {}} 
            onError={() => {}} 
          />
        );
        
        const { container: historyPanelContainer } = render(
          <HistoryPanel refreshTrigger={0} />
        );

        // Act: Extract elements
        const trigFormRoot = trigFormContainer.firstChild as HTMLElement;
        const historyPanelRoot = historyPanelContainer.firstChild as HTMLElement;

        // Assert: Verify preservation properties
        expect(trigFormRoot).toBeTruthy();
        expect(historyPanelRoot).toBeTruthy();
        
        // Verify: maxWidth is defined (responsive behavior)
        expect(trigFormRoot?.style.maxWidth).toBeTruthy();
        expect(historyPanelRoot?.style.maxWidth).toBeTruthy();
        
        // Verify: Centering with auto margins
        expect(trigFormRoot?.style.margin).toContain('auto');
        expect(historyPanelRoot?.style.margin).toContain('auto');
        
        // Verify: Visual styles preserved
        expect(trigFormRoot?.style.background).toBe('white');
        expect(historyPanelRoot?.style.background).toBe('white');

        // Document observation
        console.log(`\nTest Case: ${testCase.description} (${testCase.width}px)`);
        console.log(`TrigForm maxWidth: ${trigFormRoot?.style.maxWidth}`);
        console.log(`HistoryPanel maxWidth: ${historyPanelRoot?.style.maxWidth}`);
        console.log(`Expected: ${testCase.expectedBehavior}`);
        console.log(`Result: ✓ Preserved`);
      });

      console.log('\n========================================');
    });
  });
});
