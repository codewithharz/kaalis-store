// store/notificationStore.js
import { defineStore } from "pinia";
import apiClient from "../api/axios";
import { useUserStore } from "./user";
import { toast } from "vue-sonner";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  }),

  getters: {
    hasUnreadNotifications: (state) => state.unreadCount > 0,
    unreadNotifications: (state) => state.notifications.filter((n) => !n.read),
    messageNotifications: (state) =>
      state.notifications.filter((n) => n.type === "Message"),
    unreadMessageCount: (state) =>
      state.notifications.filter((n) => n.type === "Message" && !n.read).length,
  },

  actions: {
    // Fetch notifications for current user
    async fetchMyNotifications() {
      const userStore = useUserStore();
      try {
        this.isLoading = true;
        const response = await apiClient.get(
          "/notifications/my-notifications",
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        this.notifications = response.data.notifications;
        this.unreadCount = response.data.notifications.filter(
          (n) => !n.read
        ).length;
        return response.data.notifications;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    // Mark notification as read
    async markAsRead(notificationId) {
      const userStore = useUserStore();
      try {
        // First check if the notification exists in our local state
        const notification = this.notifications.find(
          (n) => n._id === notificationId
        );
        if (!notification) {
          console.log("Notification not found in local state:", notificationId);
          return null;
        }

        const response = await apiClient.patch(
          `/notifications/mark-read/${notificationId}`,
          {},
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        // Update local state
        if (notification && !notification.read) {
          notification.read = true;
          notification.readAt = new Date();
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }

        return response.data.notification;
      } catch (error) {
        console.error("Error marking notification as read:", error);
        // Don't throw the error - just log it and return null
        return null;
      }
    },

    // Handle message-specific notifications
    async handleMessageNotification(notification) {
      if (notification.type !== "Message") {
        console.warn("Attempted to handle non-message notification as message");
        return null;
      }

      try {
        if (!notification.read) {
          await this.markAsRead(notification._id);
        }
        return notification.relatedId;
      } catch (error) {
        console.error("Error handling message notification:", error);
        // Don't throw - return the relatedId anyway
        return notification.relatedId;
      }
    },

    async fetchMessageDetails(messageId) {
      const userStore = useUserStore();
      try {
        const response = await apiClient.get(`/messages/${messageId}`, {
          headers: { Authorization: `Bearer ${userStore.token}` },
        });

        // If message exists and has a related notification that's unread, mark it as read
        const relatedNotification = this.notifications.find(
          (n) => n.type === "Message" && n.relatedId === messageId && !n.read
        );
        if (relatedNotification) {
          await this.markAsRead(relatedNotification._id);
        }

        return {
          currentMessage: response.data.message,
          thread: response.data.thread,
        };
      } catch (error) {
        console.error("Error fetching message details:", error);
        throw error;
      }
    },

    async sendMessageReply({
      recipientId,
      subject,
      message,
      originalMessageId,
    }) {
      const userStore = useUserStore();
      try {
        const response = await apiClient.post(
          "/messages/reply",
          {
            recipientId,
            subject,
            message,
            originalMessageId,
          },
          {
            headers: { Authorization: `Bearer ${userStore.token}` },
          }
        );

        // Optionally refresh notifications after sending reply
        await this.fetchMyNotifications();

        return response.data.message;
      } catch (error) {
        console.error("Error sending message reply:", error);
        throw error;
      }
    },

    // Update state when a new notification is received
    addNotification(notification) {
      this.notifications.unshift(notification);
      if (!notification.read) {
        this.unreadCount++;
      }
    },

    // Reset store (for logout)
    reset() {
      this.notifications = [];
      this.unreadCount = 0;
      this.isLoading = false;
      this.error = null;
    },
  },
});
