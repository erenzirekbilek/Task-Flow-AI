import { FuzzyMatcher, FuzzyResult } from './fuzzyMatcher';
import { DeterministicParser, ParseResult } from './deterministicParser';

export type DecisionAction = 'ADD' | 'DUPLICATE' | 'SKIP' | 'NEED_CLARIFICATION';

export interface DecisionNode {
  action: DecisionAction;
  confidence: number;
  message: string;
  data?: {
    companyName?: string;
    metroStation?: string;
    existingMatch?: FuzzyResult;
  };
}

export interface DecisionResult {
  decision: DecisionNode;
  shouldAdd: boolean;
}

export class DecisionTree {
  private static readonly CONFIDENCE_THRESHOLD = {
    HIGH: 0.85,
    MEDIUM: 0.7,
    LOW: 0.5,
  };

  static evaluate(
    rawInput: string,
    existingCompanies: string[]
  ): DecisionResult {
    const parseResult = DeterministicParser.parse(rawInput);

    if (!parseResult.success) {
      return this.createDecision({
        action: 'NEED_CLARIFICATION',
        confidence: 1,
        message: parseResult.error || 'Unable to parse input',
      });
    }

    const { name, metroStation } = parseResult.data!;

    if (!name || name.trim().length === 0) {
      return this.createDecision({
        action: 'NEED_CLARIFICATION',
        confidence: 1,
        message: 'Company name is required',
      });
    }

    const fuzzyMatch = this.checkDuplicates(name, existingCompanies);

    if (fuzzyMatch && fuzzyMatch.matched) {
      return this.createDecision({
        action: 'DUPLICATE',
        confidence: fuzzyMatch.score,
        message: `Company "${name}" already exists (similarity: ${Math.round(fuzzyMatch.score * 100)}%)`,
        data: {
          companyName: name,
          metroStation,
          existingMatch: fuzzyMatch,
        },
      }, false);
    }

    if (fuzzyMatch && fuzzyMatch.score >= this.CONFIDENCE_THRESHOLD.LOW) {
      return this.createDecision({
        action: 'DUPLICATE',
        confidence: fuzzyMatch.score,
        message: `Possible duplicate: "${fuzzyMatch.original}" (similarity: ${Math.round(fuzzyMatch.score * 100)}%)`,
        data: {
          companyName: name,
          metroStation,
          existingMatch: fuzzyMatch,
        },
      }, false);
    }

    return this.createDecision({
      action: 'ADD',
      confidence: 1,
      message: `Ready to add "${name}" at ${metroStation || 'unknown station'}`,
      data: {
        companyName: name,
        metroStation,
      },
    }, true);
  }

  private static checkDuplicates(
    companyName: string,
    existingCompanies: string[]
  ): FuzzyResult | null {
    if (existingCompanies.length === 0) return null;
    return FuzzyMatcher.isDuplicate(companyName, existingCompanies);
  }

  private static createDecision(
    decision: DecisionNode,
    shouldAdd: boolean
  ): DecisionResult {
    return { decision, shouldAdd };
  }

  static getDecisionExplanation(result: DecisionResult): string {
    const { decision } = result;
    return `[${decision.action}] ${decision.confidence > 0.8 ? '✓' : decision.confidence > 0.5 ? '?' : '!'}: ${decision.message}`;
  }
}