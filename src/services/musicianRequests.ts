import { api } from './api';

interface CreateMusicianRequestPayload {
  userId: string;
  eventType: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  instrument: string;
  budget: number;
  comments: string;
}

export const createMusicianRequest = async (data: CreateMusicianRequestPayload) => {
  const response = await api.post('/musician-requests', data);
  return response.data;
};

export const acceptMusicianRequest = async ({ requestId, musicianId }: { requestId: string; musicianId: string }) => {
  const response = await api.post('/musician-requests/accept', { requestId, musicianId });
  return response.data;
};

export const cancelMusicianRequest = async (requestId: string) => {
  const response = await api.post('/musician-requests/cancel', { requestId });
  return response.data;
};

export const getMusicianRequestStatus = async (id: string) => {
  const response = await api.get(`/musician-requests/${id}/status`);
  return response.data;
}; 