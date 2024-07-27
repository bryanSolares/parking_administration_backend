export type EmailData = {
  to: string;
  subject: string;
  text: string;
};

export interface NotificationMailRepository {
  assignmentMail(
    employee: { name: string; email: string; token: string },
    location: { name: string; address: string; slotNumber: string },
    schedule: { startTime: string; endTime: string }
  ): Promise<void>;
  assignmentGuestMail(
    owner: { name: string; email: string },
    guest: { name: string; email: string },
    location: { name: string; address: string; slotNumber: string },
    schedule: { startDate: string; endDate: string }
  ): Promise<void>;
  discountNoteMail(
    owner: { name: string; email: string },
    rrhh: { name: string; email: string }
  ): Promise<void>;
}
