import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface CustomersFiltersProps {
  value: string;
  setValue: (username: string) => void;
  placeholder?: string;
}

export function CustomersFilters(props: CustomersFiltersProps): React.JSX.Element {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    props.setValue(event.target.value);
  }
  return (
    <Card sx={{ p: 1 }}>
      <OutlinedInput
        defaultValue=""
        value={props.value}
        onChange={handleOnChange}
        fullWidth
        placeholder={props.placeholder}
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px' }}
      />
    </Card>
  );
}
