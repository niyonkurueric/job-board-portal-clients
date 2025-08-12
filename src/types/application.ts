export interface Application {
  id: string;
  jobId: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  jobTitle?: string;
  company?: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate?: string;
  cvLink?: string;
  coverLetter?: string;
}
