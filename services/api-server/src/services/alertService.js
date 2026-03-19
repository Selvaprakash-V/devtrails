import Alert from '../models/Alert.js';

export const createAlert = async (workerId, type, title, message, data = {}, severity = 'info') => {
  const alert = await Alert.create({
    workerId,
    type,
    title,
    message,
    data,
    severity,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });

  return alert;
};

export const getActiveAlerts = async (workerId) => {
  const alerts = await Alert.find({
    workerId,
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ createdAt: -1 }).limit(10);

  return alerts;
};

export const markAlertAsRead = async (alertId) => {
  await Alert.findByIdAndUpdate(alertId, { isRead: true });
};

export const deactivateAlert = async (alertId) => {
  await Alert.findByIdAndUpdate(alertId, { isActive: false });
};

export const deactivateAlertsByType = async (workerId, type) => {
  await Alert.updateMany(
    { workerId, type, isActive: true },
    { isActive: false }
  );
};
