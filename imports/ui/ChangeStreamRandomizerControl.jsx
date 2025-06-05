import React, { useState } from 'react';

export const ChangeStreamRandomizerControl = () => {
  const [intervalMs, setIntervalMs] = useState(1000);
  const [running, setRunning] = useState(false);
  const [loading, setLoading] = useState(false);

  const start = () => {
    setLoading(true);
    Meteor.call('links.startRandomizer', intervalMs, (err, res) => {
      setLoading(false);
      if (!err) setRunning(true);
    });
  };

  const stop = () => {
    setLoading(true);
    Meteor.call('links.stopRandomizer', (err, res) => {
      setLoading(false);
      if (!err) setRunning(false);
    });
  };

  return (
    <div style={{margin: '24px 0', padding: 16, background: '#f3f6fa', borderRadius: 8, maxWidth: 400}}>
      <h3>Random Changes Control</h3>
      <div style={{marginBottom: 8}}>
        <label>
          Interval (ms):
          <input
            type="number"
            min={200}
            step={100}
            value={intervalMs}
            onChange={e => setIntervalMs(Number(e.target.value))}
            disabled={running || loading}
            style={{marginLeft: 8, width: 100}}
          />
        </label>
      </div>
      <button onClick={start} disabled={running || loading} style={{marginRight: 8}}>
        Start
      </button>
      <button onClick={stop} disabled={!running || loading}>
        Stop
      </button>
      {loading && <span style={{marginLeft: 12}}>Please wait...</span>}
      {running && !loading && <span style={{marginLeft: 12, color: 'green'}}>Running</span>}
      {!running && !loading && <span style={{marginLeft: 12, color: 'red'}}>Stopped</span>}
    </div>
  );
};
