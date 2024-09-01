'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import CustomizedSnackBars, { CustomizedSnackBarsProps } from '@/components/core/SimpleSnackbar';
import { useAppSelector } from '@/hooks/hooks';
import { useUpdateManagerMutation } from '@/redux/services/admin-slice';

export function UpdatePasswordForm(): React.JSX.Element {

  const [password, setPassword] = React.useState<string>('')
  const [retypePassword, setRetypePassword] = React.useState<string>('')
  const [toast, setToast] = React.useState<CustomizedSnackBarsProps>({ open: false, message: '', status: 'success' });

  const { admin } = useAppSelector(state => state.admin)

  const [updateAdmin, { isLoading: isLoadingUpdateAdmin }] = useUpdateManagerMutation()

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleRetypePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRetypePassword(event.target.value)
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (password !== retypePassword) {
          setToast({ open: true, message: 'Password and retype password do not match', status: 'error' })
          return
        }
        const response = await updateAdmin({ managerId: admin.id, password })
        if (response.error) {
          console.log(response)
          const { data: { message } } = response.error as any
          setToast({ open: true, message, status: 'error' })
        }
        else {
          setPassword('')
          setRetypePassword('')
          setToast({ open: true, message: 'Update password successfully', status: 'success' })
        }
      }}
    >
      <Card>
        <CardHeader subheader="Update password" title="Password" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 'sm' }}>
            <FormControl fullWidth>
              <InputLabel >Password</InputLabel>
              <OutlinedInput label="Password" name="password" type="password" value={password} onChange={handlePasswordChange} />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Confirm password</InputLabel>
              <OutlinedInput label="Confirm password" name="confirmPassword" type="password" value={retypePassword} onChange={handleRetypePasswordChange} />
            </FormControl>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type='submit' variant="contained">Update</Button>
        </CardActions>
      </Card>
      <CustomizedSnackBars status={toast.status} open={toast.open} message={toast.message} setOpen={(value: boolean) => setToast({ ...toast, open: value })} />
    </form>
  );
}
