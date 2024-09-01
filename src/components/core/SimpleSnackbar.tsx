
import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export type CustomizedSnackBarsProps = {
  open: boolean;
  setOpen?: (open: boolean) => void;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info';
}

export default function CustomizedSnackBars({ open, setOpen, message, status }: CustomizedSnackBarsProps) {


  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    if (!setOpen) return;

    setOpen(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={status}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
