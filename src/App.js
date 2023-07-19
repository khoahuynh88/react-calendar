//import logo from './logo.svg';
import './App.css';
//import { googleCalendarSync, Eventcalendar, CalendarNav, SegmentedGroup, SegmentedItem, CalendarPrev, CalendarToday, CalendarNext, toast } from '@mobiscroll/react';
import CreateEventComponent from './CreateEventComponent';
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { useSession, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import DateTimePicker from 'react-datetime-picker';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

//const CALENDAR_ID = 'en.usa#holiday@group.v.calendar.google.com';

function App() {
  const [events, setEvents] = useState([]);

  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();

  const [ start, setStart ] = useState(new Date());
    const [ end, setEnd ] = useState(new Date());
    const [ eventName, setEventName ] = useState("");
    const [ eventDescription, setEventDescription ] = useState("");
  
  if(isLoading) {
    return <></>
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar'
      }
    });
    if(error) {
      alert("Error logging in to Google provider with Supabase");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function listCalendarEvent()  { 
   
    console.log("List events");
   
     fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "GET",
      headers: {
        'Authorization':'Bearer ' + session.provider_token // Access token for google
      },
      
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setEvents(data);
      //alert("Event load");
      //console.log(data);
      //console.log(events)
    }).catch((err) => {
      console.log(err.message);
  });
}
console.log(events)
async function createCalendarEvent() {
  console.log("Creating calendar event");
  const event = {
    'summary': eventName,
    'description': eventDescription,
    'start': {
      'dateTime': start.toISOString(), // Date.toISOString() ->
      'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
    },
    'end': {
      'dateTime': end.toISOString(), // Date.toISOString() ->
      'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone // America/Los_Angeles
    }
  }
  await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      'Authorization':'Bearer ' + session.provider_token // Access token for google
    },
    body: JSON.stringify(event)
  }).then((data) => {
    return data.json();
  }).then((data) => {
    console.log(data);
    alert("Event created, check your Google Calendar!");
  });
}


  return (
    <div className="App">
      <div>
  {session ?
    <>
      <h2>Hey there {session.user.email}</h2>
      <p>Start of your event</p>
      <DateTimePicker onChange={setStart} value={start} />
      <p>End of your event</p>
      <DateTimePicker onChange={setEnd} value={end} />
      <p>Event name</p>
      <input type="text" onChange={(e) => setEventName(e.target.value)} />
      <p>Event description</p>
      <input type="text" onChange={(e) => setEventDescription(e.target.value)} />
      <hr />
      <button onClick={() => createCalendarEvent()}>Create Calendar Event</button>
      <hr />
      
      <button onClick={() => listCalendarEvent()}>List Calendar Event</button>
      <hr />
      <button onClick={() => signOut()}>Sign Out</button>
    </>
    :
    <>
      <button onClick={() => googleSignIn()}>Sign In With Google</button>
    </> 
  }
  </div>
         <FullCalendar
        editable
        selectable
     
        eventSources={
          events.items
        }

        headerToolbar={{
          start: "today prev next",
          end: "dayGridMonth dayGridWeek dayGridDay",
        }}
        plugins={[daygridPlugin, interactionPlugin]}
        views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
      />
    </div>
  );
  }

export default App;
