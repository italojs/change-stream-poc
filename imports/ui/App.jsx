

import React from 'react';
import { ChangeStreamTable } from './ChangeStreamTable.jsx';
import { Hello } from './Hello.jsx';
import { Info } from './Info.jsx';
import { ChangeStreamRandomizerControl } from './ChangeStreamRandomizerControl.jsx';

export const App = () => {
  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <Hello/>
      <ChangeStreamRandomizerControl/>
      <Info/>
      <ChangeStreamTable />
    </div>
  );
};
