import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskDetails } from '../services/api';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';

const TaskDetails = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await getTaskDetails(id);
        setTask(response.data);
      } catch (err) {
        setError('Failed to fetch task details. Please try again later.');
        console.error('Error fetching task details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!task) return <Typography>Task not found</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {task.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskDetails;