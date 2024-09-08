import { useDispatch } from 'react-redux';
import { NotificationActions } from '../store/slices/notification/notificationSlice';

export const useNotification = () => {
  const dispatch = useDispatch();

  const displayNotification = notification => {
    dispatch(NotificationActions.addNotification(notification));
  };

  const clearNotification = () => {
    dispatch(NotificationActions.clearNotification());
  };

  return { displayNotification, clearNotification };
};
