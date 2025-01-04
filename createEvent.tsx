import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateEvent = ({ setCreateEvent }: { setCreateEvent: (value: boolean) => void }) => {
    const [newEvent, setNewEvent] = useState<{
        title: string;
        description: string;
        location: string;
        date: Date | null;
        status: string;
      }>({
        title: '',
        description: '',
        location: '',
        date: null,
        status: '',
      });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/events/', {
        ...newEvent,
        date: newEvent.date?.toISOString(), // Convert date to ISO string
      });
      setCreateEvent(false); // Navigate back to the main page after successful creation
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ paddingTop: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Create Event
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  variant="outlined"
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Status"
                  value={newEvent.status}
                  onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <label htmlFor="date-picker">
                  Event Date:
                  <DatePicker
                    selected={newEvent.date}
                    onChange={(date: Date|null) => setNewEvent({ ...newEvent, date })}
                    showTimeSelect
                    dateFormat="Pp"
                    id="date-picker"
                    required
                  />
                </label>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Done
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreateEvent;
