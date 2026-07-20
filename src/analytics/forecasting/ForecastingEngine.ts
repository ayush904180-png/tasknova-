/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ForecastDataPoint } from '../types';

export class ForecastingEngine {
  /**
   * Generates a 10-step linear forecast with custom regression parameters.
   * Uses simple linear regression (y = mx + b) and applies an uncertainty range.
   */
  public static generateForecast(
    historicalValues: number[],
    startDate: string,
    stepDays: number = 1
  ): ForecastDataPoint[] {
    const n = historicalValues.length;
    if (n === 0) return [];

    // Compute simple linear regression
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += historicalValues[i];
      sumXY += i * historicalValues[i];
      sumXX += i * i;
    }

    const meanX = sumX / n;
    const meanY = sumY / n;

    // Slope (m) and Intercept (b)
    let slope = 0;
    let intercept = meanY;

    if (n > 1) {
      const num = sumXY - n * meanX * meanY;
      const den = sumXX - n * meanX * meanX;
      slope = den !== 0 ? num / den : 0;
      intercept = meanY - slope * meanX;
    }

    // Generate response data
    const result: ForecastDataPoint[] = [];
    const baseDate = new Date(startDate);

    // 1. Add historical points
    for (let i = 0; i < n; i++) {
      const pointDate = new Date(baseDate);
      pointDate.setDate(baseDate.getDate() - (n - 1 - i) * stepDays);
      result.push({
        date: pointDate.toISOString().split('T')[0],
        historical: historicalValues[i]
      });
    }

    // 2. Add projected points (next 10 steps)
    const lastVal = historicalValues[n - 1];
    for (let i = 0; i < 10; i++) {
      const stepIndex = n + i;
      const pointDate = new Date(baseDate);
      pointDate.setDate(baseDate.getDate() + (i + 1) * stepDays);

      const projectedVal = Math.max(0, slope * stepIndex + intercept);
      // Standard error increments with distance from historical boundary
      const uncertaintyFactor = (i + 1) * 0.05 * lastVal;

      result.push({
        date: pointDate.toISOString().split('T')[0],
        projected: Math.round(projectedVal),
        lowerBound: Math.round(Math.max(0, projectedVal - uncertaintyFactor)),
        upperBound: Math.round(projectedVal + uncertaintyFactor)
      });
    }

    return result;
  }
}
