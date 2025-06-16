import React, { useEffect, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { LinksCollection } from '../api/links';

export const Info = () => {
  const { links, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe('links');
    return {
      links: LinksCollection.find().fetch(),
      isLoading: !handle.ready(),
    };
  }, []);

  // State to store change stream events
  const [streamEvents, setStreamEvents] = useState([]);

  useEffect(() => {
    // Subscribe to the change stream
    const sub = Meteor.subscribeStream('streamLinks');
    sub.onData((data) => {
      setStreamEvents(evts => [data, ...evts]);
    });
    return () => sub.stop();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Learn Meteor!</h2>
      <h3>Change Stream Events</h3>
      <ul>
        {streamEvents.map((evt, idx) => (
          <li key={idx}>
            <pre style={{fontSize: '0.8em', background: '#f6f6f6', padding: 8}}>{JSON.stringify(evt, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
};
