import { EventEmitter } from 'node:events';

export const events = new EventEmitter();

events.on('new-discount-note', data => {
  console.log('new discount note', data);
});
