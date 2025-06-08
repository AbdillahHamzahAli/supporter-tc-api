export type CreateAttendanceRequest = {
  code: string;
  userId: string;
  scheduleId: string;
};

export type GetAttendance = {
  userId: string;
  scheduleId: string;
};

export type AttendanceResponse = {
  status: string;
};
