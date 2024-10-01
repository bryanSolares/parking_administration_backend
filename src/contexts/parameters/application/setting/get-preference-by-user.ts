import { NotificationPreferenceRepository } from '../../core/repositories/notification-preference-repository';

export class GetPreferenceNotificationByUserUseCase {
  constructor(public readonly notificationPreferenceRepository: NotificationPreferenceRepository) {}

  async run(userId: string) {
    return this.notificationPreferenceRepository.getNotificationPreferencesByUser(userId);
  }
}
