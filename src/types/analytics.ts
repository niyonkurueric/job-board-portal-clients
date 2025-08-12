export interface AnalyticsData {
  users: number;
  jobs: number;
  applications: number;
  jobsLast6Months: { month: string; jobs: number }[];
  applicationsLast6Months: { month: string; applications: number }[];
}
