'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSelection } from '@/hooks/use-selection';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import Slide from '@mui/material/Slide';
import { useUpdateUserMutation } from '@/redux/services/user-slice';
import CustomizedSnackBars, { CustomizedSnackBarsProps } from '@/components/core/SimpleSnackbar';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface Customer {
  role: string;
  isEmailVerified: boolean;
  isBlock: boolean;
  token: number;
  level: number;
  levelMultiTap: number;
  levelEnergyLimit: number;
  totalBonusPerHours: number;
  TONWallet: string;
  sponsors: string[];
  skinUrl: string;
  remainingRechargeEachDay: number;
  lastTimeRecharge: string;
  lang: string;
  userId: string;
  username: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  refetch: () => void;
  setPage: (value: number) => void,
  setLimit: (value: number) => void,
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  refetch,
  setPage,
  setLimit
}: CustomersTableProps): React.JSX.Element {
  const [updateUser, { isLoading: isLoadingUpdateUser }] = useUpdateUserMutation()
  const [userSelected, setUserSelected] = React.useState<Customer | null>(null);
  const [toast, setToast] = React.useState<CustomizedSnackBarsProps>({ open: false, message: '', status: 'success' });

  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const [open, setOpen] = React.useState(false);
  const [blockOrUnblock, setBlockOrUnblock] = React.useState(false);

  const handleClickOpen = (user: Customer) => {
    setBlockOrUnblock(!user.isBlock);
    setOpen(true);
    setUserSelected(user);
  };

  const handleAgreeUpdateUser = async () => {
    if (!userSelected) return;
    const response = await updateUser({ userId: userSelected.userId, isBlock: !userSelected.isBlock })

    if (response.error) {
      // handle error
      setToast({ open: true, message: 'Error call api', status: 'error' })
    }
    else {
      setToast({ open: true, message: 'Update user successfully', status: 'success' })
      refetch()
    }
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPage(page);
  }

  const handleLimitPageChange = (event: any) => {
    setLimit(event.target.value);
  }

  React.useEffect(() => {
    if (!open) {
      setUserSelected(null);
    }
  }, [open])

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>TelegramId</TableCell>
              <TableCell>ID Mongo</TableCell>
              <TableCell>Token</TableCell>
              <TableCell>Mining P/H</TableCell>
              <TableCell>Block Status</TableCell>
              <TableCell>Level</TableCell>
              <TableCell>lv Tap, lv energy</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell width={100}>Tree sponsors</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.lang} />
                      <Typography variant="subtitle2">{row.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>
                    {row.userId}
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.token}</TableCell>
                  <TableCell>{row.totalBonusPerHours}</TableCell>
                  <TableCell onClick={() => handleClickOpen(row)}>
                    {row.isBlock ?
                      <Button variant="outlined" color="error">
                        Block
                      </Button> :
                      <Button variant="outlined" color="success"> None </Button>
                    }

                  </TableCell>
                  <TableCell>{row.level}</TableCell>
                  <TableCell>{row.levelMultiTap}, {row.levelEnergyLimit}</TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>{row.sponsors?.join(', ')}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        page={page - 1}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleLimitPageChange}
      />
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{blockOrUnblock ? 'Block' : 'Unblock'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want {blockOrUnblock ? 'block' : 'unblock'} this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={isLoadingUpdateUser} color='warning' onClick={handleAgreeUpdateUser}>Agree</LoadingButton>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <CustomizedSnackBars status={toast.status} open={toast.open} message={toast.message} setOpen={(value: boolean) => setToast({ ...toast, open: value })} />
    </Card>
  );
}
