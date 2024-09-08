import { useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { useNotification } from '../../hooks/useNotification';

import '../../assets/css/Notification.css';

export default function Notification() {
  const notification = useSelector(state => state?.notification);
  const { clearNotification } = useNotification();

  const handleClose = (_, reason) =>
    reason !== 'clickaway' && clearNotification();

  return (
    <Snackbar
      open={notification.open}
      autoHide-duration={notification.timeout}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      className="sainta-snackbar"
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        className={`sainta-alert sainta-alert-${notification.type}`}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}
