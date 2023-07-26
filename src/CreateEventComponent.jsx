import React from "react";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import DateTimePicker from "react-datetime-picker";
import { useState, useEffect } from "react";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

const CreateEventComponent = () => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [eventName, setEventName] = useState("");

  const event = {
    summary: eventName,
    start: {
      dateTime: start.toISOString(), // Date.toISOString() ->
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
    },
    end: {
      dateTime: end.toISOString(), // Date.toISOString() ->
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // America/Los_Angeles
    },
  };

  const session = useSession(); // tokens, when session exists we have a user

  const { isLoading } = useSessionContext();

  const [showForm, setShowForm] = useState(true);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    console.log("This is local store " + localStorage.getItem("items"));
    offlineFetch();
    function onlineHandler() {
      setIsOnline(true);
    }

    function offlineHandler() {
      setIsOnline(false);
    }

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  if (isLoading) {
    return <></>;
  }

  console.log("check online" + isOnline);
  async function createCalendarEvent() {
    //console.log("Creating calendar event");

    //check online
    if (isOnline === true) {
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token, // Access token for google
          },
          body: JSON.stringify(event),
        }
      )
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          console.log(data);
          alert("Event created, check your Google Calendar!");
        });
    } else {
      localStorage.setItem("items", JSON.stringify(event));
      console.log("This is local store " + localStorage.getItem("items"));
    }
  }

  async function offlineFetch() {
    while (localStorage.getItem("items") !== null && isOnline === true) {
      const items = JSON.parse(localStorage.getItem("items"));
      await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token, // Access token for google
          },
          body: JSON.stringify(items),
        }
      )
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          console.log(data);
          alert("Event created, after offline");
        });
      localStorage.removeItem("items");
    }
  }
  // console.log(session);
  // console.log(start);
  // console.log(eventName);
  // console.log(eventDescription);
  return (
    <div className="App">
      <div>
        {showForm ? (
          <>
            <DateTimePicker onChange={setStart} value={start} />
            <p>End of your event</p>
            <DateTimePicker onChange={setEnd} value={end} />
            <p>Event name</p>
            <input type="text" onChange={(e) => setEventName(e.target.value)} />
            <p>Event description</p>

            <button onClick={() => createCalendarEvent()}>submit</button>
            <button onClick={() => setShowForm(false)}>Exit</button>
            <p></p>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CreateEventComponent;
