import React, { useState } from 'react';
import { Box, createTheme, TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { orderBy } from 'lodash';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { getAppData } from '../api/getapp';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

export default function Home({ result }) {
  const [data, setData] = useState(result);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = () => {
    const nextSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    const sorted = orderBy(data, 'id', nextSortDirection);
    setData(sorted);
    setSortDirection(nextSortDirection);
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filteredData = result.filter((item) => {
      return item.line.toLowerCase().includes(value);
    });
    setData(filteredData);
  };

  const renderSortIcon = () => {
    if (sortDirection === 'asc') {
      return <ArrowDropDownIcon sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }} />;
    } else {
      return <ArrowDropUpIcon sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        padding: '100px',
        borderRadius: '20px',
      }}>
        <TableContainer component={Paper} sx={{boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2), 0px 6px 6px rgba(0, 0, 0, 0.2)'}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell sx={{ color: 'white', cursor: 'pointer' }} onClick={handleSort}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">ID</Typography>
                    <IconButton onClick={handleSort} size="small">
                      {renderSortIcon()}
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Process</Typography>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <TextField
                      id="process-search"
                      label="Search"
                      size="small"
                      variant="outlined"
                      value={searchTerm}
                      onChange={handleSearch}
                      inputProps={{
                        style: {
                          color: 'white',
                        },
                      }}
                      sx={{
                        '& label.Mui-focused': {
                          color: 'white',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'white',
                          },
                          '&:hover fieldset': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white',
                          },
                        }
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data.length > 0 ? data : result).map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell>{item.line}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
}

export async function getServerSideProps(context) {
  const res = await getAppData();
  const result = res.props.result;
  for (let i = 0; i < result.length; i++) {
    result[i].id = i;
    result[i].detail = '';
  }

  return {
    props: {
      result,
    },
  };
}