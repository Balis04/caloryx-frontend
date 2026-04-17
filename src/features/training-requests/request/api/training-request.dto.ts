export interface CreateTrainingRequestDto {
  weeklyTrainingCount: number;
  sessionDurationMinutes: number;
  preferredLocation: string;
  requestDescription: string;
}
