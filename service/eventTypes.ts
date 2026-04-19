export const COMPANY_ACTIONS = {
  ADD: 'add',
  UPDATE: 'update',
  DELETE: 'delete',
  TOGGLE: 'toggle',
} as const;

export type CompanyAction = typeof COMPANY_ACTIONS[keyof typeof COMPANY_ACTIONS];