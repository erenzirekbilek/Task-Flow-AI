export interface HeuristicRule {
  name: string;
  condition: (context: any) => boolean;
  action: (context: any) => any;
  priority: number;
  enabled: boolean;
}

export interface RuleResult {
  rule: string;
  triggered: boolean;
  result: any;
}

export class HeuristicEngine {
  private rules: HeuristicRule[] = [];

  addRule(name: string, condition: (ctx: any) => boolean, action: (ctx: any) => any, priority: number = 5): void {
    this.rules.push({ name, condition, action, priority, enabled: true });
    this.rules.sort((a, b) => b.priority - a.priority);
  }

  addRuleIf(name: string, condition: (ctx: any) => boolean, action: (ctx: any) => any): void {
    this.addRule(name, condition, action, 5);
  }

  removeRule(name: string): void {
    this.rules = this.rules.filter(r => r.name !== name);
  }

  disableRule(name: string): void {
    const rule = this.rules.find(r => r.name === name);
    if (rule) rule.enabled = false;
  }

  enableRule(name: string): void {
    const rule = this.rules.find(r => r.name === name);
    if (rule) rule.enabled = true;
  }

  evaluate(context: any): RuleResult[] {
    const results: RuleResult[] = [];
    this.rules.filter(r => r.enabled).forEach(rule => {
      try {
        if (rule.condition(context)) {
          const result = rule.action(context);
          results.push({ rule: rule.name, triggered: true, result });
        }
      } catch (e) {
        results.push({ rule: rule.name, triggered: false, result: e });
      }
    });
    return results;
  }

  firstMatch(context: any): RuleResult | null {
    for (const rule of this.rules.filter(r => r.enabled)) {
      try {
        if (rule.condition(context)) {
          return { rule: rule.name, triggered: true, result: rule.action(context) };
        }
      } catch {}
    }
    return null;
  }
}