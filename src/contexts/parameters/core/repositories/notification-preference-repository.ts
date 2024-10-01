import { NotificationPreferencesEntity, NotificationTypePreference } from '../entities/notification-preference-entity';

export interface NotificationPreferenceRepository {
  getNotificationPreferencesByUser(userId: string): Promise<Array<NotificationPreferencesEntity>>;
  saveNotificationPreferences(notificationPreferences: {
    userId: string;
    preferences: Array<NotificationTypePreference>;
  }): Promise<void>;
}
