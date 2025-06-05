
import { Meteor } from 'meteor/meteor';

// Global variable for logs (kept for compatibility)
window.changeStreamLogs = [];
window.changeStreamLogId = 1;


import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '/imports/ui/App';

let counter = 0
Meteor.startup(() => {
  const container = document.getElementById('react-target');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
  if (Meteor.connection) {
    Meteor.connection._stream.on('message', (stringMSG) => {
      const msg = JSON.parse(stringMSG);
      counter++;
      msg.counter = counter; // Add unique counter for each message
      // Fire custom event for compatibility
      window.dispatchEvent(new CustomEvent('changeStreamLogUpdated', {
        detail: msg
      }));
    });
  }
});
