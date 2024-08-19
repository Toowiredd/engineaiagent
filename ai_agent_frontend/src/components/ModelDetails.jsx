import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { getModelDetails, createTask } from '../services/api';

const ModelDetails = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [inputData, setInputData] = useState('');
  const [taskType, setTaskType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const fetchModelDetails = async () => {
      try {
        setLoading(true);
        const response = await getModelDetails(modelId);
        setModel(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch model details:', error);
        setError('Failed to fetch model details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchModelDetails();
  }, [modelId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!taskType.trim() || !inputData.trim()) {
      setFormError('Task type and input data are required');
      return;
    }

    try {
      setLoading(true);
      const response = await createTask(modelId, taskType, inputData);
      navigate(`/tasks/${response.data.taskId}`);
    } catch (error) {
      console.error('Failed to create task:', error);
      setFormError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!model) {
    return <Typography>No model found.</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {model.name}
      </Typography>
      <Typography variant="body1" paragraph>
        {model.description}
      </Typography>
      <Box component="form" onSubmit={handleCreateTask} sx={{ mt: 2 }}>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <TextField
          fullWidth
          label="Task Type"
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Input Data"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={loading}>
          {loading ? 'Creating...' : 'Create Task'}
        </Button>
      </Box>
    </Box>
  );
};

export default ModelDetails;