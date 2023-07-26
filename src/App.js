//import logo from './logo.svg';
import "./App.css";
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";

import CreateEventComponent from "./CreateEventComponent";

function App() {
  const [events, setEvents] = useState([]);
  const session = useSession(); // tokens, when session exists we have a user
  const supabase = useSupabaseClient(); // talk to supabase!
  const { isLoading } = useSessionContext();
  const [showComponent, setShowComponent] = useState(false);
  let showevent = [];

  if (isLoading) {
    return <></>;
  }

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) alert("Error logging in to Google provider with Supabase");
    console.log(error);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function listCalendarEvent() {
    console.log("List events");

    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + session.provider_token, // Access token for google
      },
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setEvents(data);
        console.log(events);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  let islist;
  //Convert eventlist to JSON object
  if (events.length !== 0) {
    islist = true;
  }
  if (islist === true) {
    for (let i = 0; i < events.items.length; i++) {
      showevent.push({
        title: events.items[i].summary,
        date: events.items[i].start.dateTime,
      });
    }
  }

  function handleClick() {
    setShowComponent(!showComponent); // Toggle the value of showComponent on each click
  }

  return (
    <div className="App">
      <div>
        {session ? (
          <>
            <h2>Hey there {session.user.email}</h2>
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <>
            <button onClick={() => googleSignIn()}>Sign In With Google</button>
          </>
        )}
      </div>
      <div>{showComponent ? <CreateEventComponent /> : <p></p>}</div>
      <FullCalendar
        editable
        selectable
        events={showevent}
        customButtons={{
          myCustomButton: {
            text: "+",
            click: () => {
              handleClick();
            },
          },
          listEvent: {
            text: "List Event",
            click: () => {
              listCalendarEvent();
            },
          },
        }}
        headerToolbar={{
          start: "myCustomButton today prev next",
          end: "listEvent dayGridMonth dayGridWeek dayGridDay",
        }}
        plugins={[daygridPlugin, interactionPlugin]}
        views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
      />
    </div>
  );
}

export default App;
