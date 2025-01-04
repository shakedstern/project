import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Container, Typography, Grid, Paper } from '@mui/material';

interface EditEventProps {
  event: any;  // Event to edit
  setEditingEvent: (event: any) => void;  // Function to go back to event list (reset state)
}

const EditEvent = ({ event, setEditingEvent }: EditEventProps) => {
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/events/${updatedEvent._id}`, {
        title: updatedEvent.title,
        version: updatedEvent.version,
        location: updatedEvent.location,
        date: updatedEvent.date,
        description: updatedEvent.description,
      });
      setEditingEvent(null);  // Reset state to go back to event list after successful update
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Format the date for the datetime-local input
  const formattedDate = new Date(updatedEvent.date).toISOString().slice(0, 16);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>Edit Event</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={updatedEvent.title}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, title: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={updatedEvent.description}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, description: e.target.value })}
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={updatedEvent.location}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, location: e.target.value })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="datetime-local"
                value={formattedDate}  // Use the formatted date here
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, date: e.target.value })}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Version"
                type="number"
                value={updatedEvent.version}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, version: Number(e.target.value) })}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" color="primary" type="submit">
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditEvent;
