export interface CustomerPolicyInterface {
  ensureEmailIsUnique(email: string): Promise<void>;
}
