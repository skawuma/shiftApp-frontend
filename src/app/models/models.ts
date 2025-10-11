export type DayOfWeek = 'MONDAY'|'TUESDAY'|'WEDNESDAY'|'THURSDAY'|'FRIDAY'|'SATURDAY'|'SUNDAY';

export type Shift = 'MORNING_7_15'|'AFTERNOON_15_23'|'NIGHT_23_7';

export interface EmployeeRequest {
  id?: number;
  employeeName: string;
  requestedDays: DayOfWeek[];
  shift: Shift;
  status?: 'PENDING'|'APPROVED'|'REJECTED';
  adminComment?: string;
}
