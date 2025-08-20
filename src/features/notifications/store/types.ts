export enum NotificationType {
  Success = "success",
  Error = "error",
  Info = "info",
  Warning = "warning",
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

export type NotificationInput = Omit<Notification, "id" | "createdAt" | "read">;
