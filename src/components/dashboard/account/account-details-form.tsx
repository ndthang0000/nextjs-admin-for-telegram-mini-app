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
import Grid from '@mui/material/Unstable_Grid2';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useUpdateManagerMutation } from '@/redux/services/admin-slice';
import CustomizedSnackBars, { CustomizedSnackBarsProps } from '@/components/core/SimpleSnackbar';
import { setAdmin } from '@/redux/slice/admin-slice';


export function AccountDetailsForm(): React.JSX.Element {
  const { admin } = useAppSelector(state => state.admin)
  const [updateAdmin] = useUpdateManagerMutation()
  const [name, setName] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [toast, setToast] = React.useState<CustomizedSnackBarsProps>({ open: false, message: '', status: 'success' });

  const dispatch = useAppDispatch()

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  React.useEffect(() => {
    setName(admin.name)
    setEmail(admin.email)
  }, [admin])

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const response = await updateAdmin({ managerId: admin.id, email, name })
        if (response.error) {

          const { data: { message } } = response.error as any
          setToast({ open: true, message, status: 'error' })
        }
        else {
          console.log(response)
          dispatch(setAdmin(response.data.data))
          setToast({ open: true, message: 'Update Your info successfully', status: 'success' })
        }
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput defaultValue={admin.name} label="Name" name="name" value={name} onChange={handleNameChange} />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue={admin.email} label="Email" name="email" value={email} onChange={handleEmailChange} />
              </FormControl>
            </Grid>
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue="sofia@devias.io" label="Email address" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel" />
              </FormControl>
            </Grid> */}
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select defaultValue="New York" label="State" name="state" variant="outlined">
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput label="City" />
              </FormControl>
            </Grid> */}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type='submit' variant="contained">Save details</Button>
        </CardActions>
      </Card>
      <CustomizedSnackBars status={toast.status} open={toast.open} message={toast.message} setOpen={(value: boolean) => setToast({ ...toast, open: value })} />

    </form>
  );
}
