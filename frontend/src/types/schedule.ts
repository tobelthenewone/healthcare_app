export interface ProfessionalSchedule {

  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";

  enabled: boolean;

  startHour: number | null;

  endHour: number | null;

  breakStartHour: number | null;

  breakEndHour: number | null;
}