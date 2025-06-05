
import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';

export const Hello = () => {
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(null);

  const handleInsert = () => {
    setLoading(true);
    Meteor.call('links.insertOperation', (err, res) => {
      setLoading(false);
      setLastId(res || null);
    });
  };

  const handleUpdate = () => {
    setLoading(true);
    Meteor.call('links.updateOperation', (err, res) => {
      setLoading(false);
      setLastId(res || null);
    });
  };

  const handleRemove = () => {
    setLoading(true);
    Meteor.call('links.removeTest', (err, res) => {
      setLoading(false);
      setLastId(res || null);
    });
  };

  const handleUpsert = () => {
    setLoading(true);
    Meteor.call('links.upsertOperation', (err, res) => {
      setLoading(false);
      setLastId(res || null);
    });
  };

  return (
    <div>
      <button onClick={handleInsert} disabled={loading}>Add Link</button>
      <button onClick={handleUpdate} disabled={loading}>Update Link</button>
      <button onClick={handleRemove} disabled={loading}>Remove Link</button>
      <button onClick={handleUpsert} disabled={loading}>Upsert Link</button>
      {loading && <span style={{marginLeft: 8}}>Sending request...</span>}
      {lastId && <div style={{fontSize: 12, marginTop: 8}}>Last operation on: {lastId}</div>}
    </div>
  );
};
