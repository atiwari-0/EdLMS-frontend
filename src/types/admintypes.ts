export type EntityType = 'Students' | 'Teachers' | 'Classes' | 'Subjects';

export interface EntityData {
  id?: string;
  name?: string;
  email?: string;
  classId?: string;
  className?: string;
  subjectId?: string;
  subjectName?: string;
  classIds?: string[];
  classNames?: string[];
}

export interface EntityField {
  name: keyof EntityData;
  type: 'text' | 'email' | 'select' | 'multiselect';
  options?: { id: string; name: string }[];
  required?: boolean;
}