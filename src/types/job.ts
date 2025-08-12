// Types for job form data and API response
export type CreateJobFormData = {
  title: string;
  company: string;
  location: string;
  description: string;
  deadline: Date | null;
};

export type CreateJobResponse = {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  deadline?: string;
  created_at?: string;
  created_by?: number;
};
