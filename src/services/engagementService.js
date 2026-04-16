const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const toggleWishlistItem = (wishlist = [], product) => {
  const exists = wishlist.some(item => item.id === product.id);
  if (exists) {
    return wishlist.filter(item => item.id !== product.id);
  }
  return [...wishlist, product];
};

export const markNotificationAsRead = (notifications = [], id) =>
  notifications.map(notification =>
    notification.id === id ? { ...notification, read: true } : notification
  );

export const markAllNotificationsAsRead = (notifications = []) =>
  notifications.map(notification => ({ ...notification, read: true }));

export const fetchNotificationFeed = async (notifications = []) => {
  await delay(250);
  return notifications;
};

export const engagementService = {
  toggleWishlistItem,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  fetchNotificationFeed,
};

export default engagementService;
