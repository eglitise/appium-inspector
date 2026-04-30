import {combineReducers} from '@reduxjs/toolkit';

import builder from './SessionBuilder.js';
import inspector from './SessionInspector.js';

/**
 * Creates the root reducer for the application.
 * @returns {Reducer} - The root reducer
 */
export default function createRootReducer() {
  return combineReducers({
    builder,
    inspector,
  });
}
