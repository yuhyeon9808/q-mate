import { LockStatus } from '@/types/InviteType';
import axios from 'axios';

//초대 코드 발급
export const createInviteCode = async ({
  relationType,
  startDate,
}: {
  relationType: 'COUPLE' | 'FRIEND';
  startDate: string | null;
}) => {
  const res = await axios.post(`/api/matches`, { relationType, startDate });
  return res.data;
};

//초대 코드 연결
export const connectWithInviteCode = async ({ inviteCode }: { inviteCode: string }) => {
  const res = await axios.post(`/api/matches/join`, { inviteCode });
  return res.data;
};

// 계정 잠김 조회
export const fetchLockStatus = async (): Promise<LockStatus> => {
  const res = await axios.get(`/api/matches/lock-status`);
  return res.data;
};

//초대코드 유효성 검증
export const checkInviteCode = async ({ inviteCode }: { inviteCode: string }) => {
  const res = await axios.post(`/api/invites/validate`, { inviteCode });
  return res.data;
};
