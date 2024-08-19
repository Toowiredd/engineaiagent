import React, { useState, useEffect } from 'react';
import { getModels } from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchModels();
  }, [page, search]);

  const fetchModels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getModels(page, limit, search);
      setModels(response.data.data);
    } catch (err) {
      setError('Failed to fetch models. Please try again later.');
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleModelClick = (id) => {
    navigate(`/models/${id}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <TextField
        label="Search models"
        variant="outlined"
        value={search}
        onChange={handleSearchChange}
        style={{ marginBottom: '1rem' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id} onClick={() => handleModelClick(model.id)} style={{ cursor: 'pointer' }}>
                <TableCell>{model.name}</TableCell>
                <TableCell>{model.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
      <Button onClick={() => setPage(page + 1)}>Next</Button>
    </div>
  );
};

export default ModelList;