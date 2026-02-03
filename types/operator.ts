/**
 * Operator role type
 */
export type OperatorRole = 'admin' | 'super_admin';

/**
 * Operator entity (admin users)
 */
export interface Operator {
  id: string;
  userId: string;
  role: OperatorRole;
  createdAt: string;
}
