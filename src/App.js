import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orderBy } from 'lodash';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'https://jsonplaceholder.typicode.com/posts'
      );
      setData(result.data);
    };
    fetchData();
  }, []);

  const handleSort = () => {
    const nextSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    const sorted = orderBy(data, 'id', nextSortDirection);
    setSortedData(sorted);
    setSortDirection(nextSortDirection);
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
      <Box sx={{ padding: '30px' }}>
        <TableContainer component={Paper}>
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
                  <Typography variant="subtitle1" fontWeight="bold">Title</Typography>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <Typography variant="subtitle1" fontWeight="bold">Status</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(sortedData.length > 0 ? sortedData : data).map((item) => (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    {item.id}
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.body}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
}

export default App;
