export const MEMORY_TYPES = [
  { value: 'preference', label: 'Preference', description: 'How you prefer things done' },
  { value: 'constraint', label: 'Constraint', description: 'A hard limit or requirement' },
  { value: 'rule_of_thumb', label: 'Rule of Thumb', description: 'A practical guideline from experience' },
  { value: 'risk_tolerance', label: 'Risk Tolerance', description: 'What you will or will not risk' },
  { value: 'supplier_exclusion', label: 'Supplier Exclusion', description: 'A vendor or product to avoid' },
] as const;

export const CONFIDENCE_LEVELS = [
  { value: 'tentative', label: 'Tentative', description: 'Still testing — AI may suggest alternatives' },
  { value: 'standard', label: 'Standard', description: 'Reliable — AI should respect this' },
  { value: 'strict', label: 'Strict', description: 'Non-negotiable — AI must always follow' },
] as const;

export type MemoryType = typeof MEMORY_TYPES[number]['value'];
export type ConfidenceLevel = typeof CONFIDENCE_LEVELS[number]['value'];

export interface MemoryFormData {
  content: string;
  memory_type: MemoryType;
  confidence: ConfidenceLevel;
  tags: string[];
}
