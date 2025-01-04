import React, { useEffect, useState } from 'react';
import { TextField,AppBar, Toolbar, IconButton, Typography, Card, CardActionArea, CardContent, CardActions, Button, Box } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import EditEvent from './EventUpdate';  // Import the EditEvent component
import CreateEvent from './createEvent';
import {  MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
interface EventItem {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  version:number;
  status:string;
}

function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({field:'',value:''});
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);  // State for the event to be edited
  const [createEvent, setcreateEvent] = useState(false);
  const filterFields = ['location','status','date']
  const getEvents = async (filter: {field:string,value:string}|null=null) => {
    try {
      const query=filter?`?${filter?.field}=${filter?.value}`:''
      const response = await axios.get(`http://localhost:3001/events/${query}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeEvent = async (_id: string) => {
    try {
      await axios.delete(`http://localhost:3001/events/${_id}`);
      setEvents(events.filter(event => event._id !== _id));  // Remove the event from the list after deletion
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  

  useEffect(() => {
    getEvents();
  }, []);

  if (editingEvent) {
    return <EditEvent event={editingEvent} setEditingEvent={setEditingEvent} />;  // Render the EditEvent page
  }
  if (createEvent) {
    return <CreateEvent  setCreateEvent={setcreateEvent} />;  // Render the EditEvent page
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={() => setcreateEvent(true)}>
            <AddCircleIcon />
          </IconButton>
          <Typography variant="h6">Event Manager</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, padding: 3, borderRadius: 2 }}>
     

      <FormControl fullWidth variant="outlined">
        <InputLabel id="filter-label">Filter by</InputLabel>
        <Select
          labelId="filter-label"
          value={filter.field}
          onChange={(e) => setFilter({ ...filter, field: e.target.value })}
          label="Filter by"
          sx={{ borderRadius: 2 }}
        >
          {filterFields.map((field: string) => (
            <MenuItem key={field} value={field}>
              {field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Enter filter value"
        value={filter.value}
        onChange={(e) => setFilter({ ...filter, value: e.target.value })}
        variant="outlined"
        sx={{ borderRadius: 2 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          onClick={() => getEvents(filter)}
        >
          <SearchIcon />
          Search
        </Button>
      </Box>


    </Box>
        {loading ? (
          <Typography>Loading events...</Typography>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            {events.map(event => (
              <Card key={event._id} sx={{ marginBottom: '20px', width: '100%', maxWidth: '600px' }}>
                <CardActionArea>
                  {/* Clicking the card itself will navigate to the update page */}
                  <CardContent>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="body2" color="textSecondary">description: {event.description}</Typography>
                    <Typography variant="body2" color="textSecondary">location: {event.location}</Typography>
                    <Typography variant="body2" color="textSecondary">date: {event.date}</Typography>
                    <Typography variant="body2" color="textSecondary">id: {event._id}</Typography>
                    <Typography variant="body2" color="textSecondary">version: {event.version}</Typography>
                    <Typography variant="body2" color="textSecondary">status: {event.status}</Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => setEditingEvent(event)}  // Set the event to be edited
                  >
                    Update
                  </Button>
                  <Button 
                    size="small" 
                    color="secondary" 
                    onClick={() => removeEvent(event._id)}  // Remove event
                    sx={{ backgroundColor: '#B15AA8', color: 'white', '&:hover': { backgroundColor: '#a04894' } }}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        )}
      </Box>
    </>
  );
}

export default App;
