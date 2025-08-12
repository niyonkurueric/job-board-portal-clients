import { apiFetch } from './apiFetch';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';

export const updateJob = async (jobId: string | number, jobData: any) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }, true);
};

export const createJob = async (jobData: {
  title: string;
  company: string;
  location: string;
  description: string;
}) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/jobs`, {
    method: 'POST',
    body: JSON.stringify(jobData),
  }, true);
};


export const fetchJobs = async (page = 1, pageSize = 10) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  const url = `${BACKEND_URL}/api/jobs?page=${page}&pageSize=${pageSize}`;
  return apiFetch(url);
};

export const applyToJob = async (jobId: string, userData: any) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/jobs/${jobId}/apply`, {
    method: 'POST',
    body: JSON.stringify(userData),
  }, true);
};

export const fetchJobById = async (jobId: string | number) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/jobs/${jobId}`);
};

export const deleteJob = async (jobId: string | number) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600';
  return apiFetch(`${BACKEND_URL}/api/jobs/${jobId}`, {
    method: 'DELETE',
  }, true);
};
