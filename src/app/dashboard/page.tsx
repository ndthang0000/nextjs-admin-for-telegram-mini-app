'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { useFetchUserQuery, useLazyExportUserQuery } from '@/redux/services/user-slice';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const sortOptions: {
  [key: string]: string
} = {
  'createdAt:asc': 'Oldest user',
  'createdAt:desc': 'Newest user',
  'token:asc': 'Smallest Token',
  'token:desc': 'Biggest Token',
  'level:asc': 'Smallest Level',
  'level:desc': 'Biggest Level',
  'totalBonusPerHours:asc': 'Smallest Mining',
  'totalBonusPerHours:desc': 'Biggest Mining',
}



export default function Page(): React.JSX.Element {

  const [triggerExport, { isLoading: isLoadingExport }] = useLazyExportUserQuery();

  const [userId, setUserId] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [sortBy, setSortBy] = React.useState('createdAt:asc');

  const { data, refetch } = useFetchUserQuery({
    userId, // Provide the user ID
    username, // Provide the username
    limit, // Provide the limit
    page, // Provide the page number
    sortBy
  });
  console.log({ data })
  const handleChangeSort = (event: any) => {
    setSortBy(event.target.value as string);
  }

  const handleExportUser = async () => {
    const dataExport = await triggerExport().unwrap();
    if (dataExport?.status && dataExport.data) {
      const link = document.createElement('a');
      link.href = dataExport.data;
      link.setAttribute('download', 'user-1-9.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">User</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <LoadingButton loading={isLoadingExport} color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} onClick={handleExportUser}>
              Export
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={3}>
        <CustomersFilters value={username} setValue={setUsername} placeholder='Search username telegram' />
        <CustomersFilters value={userId} setValue={setUserId} placeholder='Search telegram ID' />
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sortBy}
            label="Sort By"
            onChange={handleChangeSort}
          >
            {
              Object.keys(sortOptions).map((key: string, index: number) =>

                <MenuItem key={index} value={key}>{sortOptions[key]}</MenuItem>)
            }
          </Select>
        </Stack>
      </Stack>
      <CustomersTable
        count={data?.totalResults || 0}
        page={data?.page || 0}
        rows={data?.results || []}
        rowsPerPage={data?.limit || 0}
        setPage={setPage}
        setLimit={setLimit}
        refetch={refetch}
      />
    </Stack>
  );
}

// function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
//   return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
// }
