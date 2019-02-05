import { PubSub } from 'apollo-server';
import * as MESSAGE_EVENTS from './message';

export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
};

export default new PubSub();

/*
This PubSub instance is your API which enables subscriptions in your application. 

Read more here:
https://www.apollographql.com/docs/apollo-server/v2/features/subscriptions.html#PubSub-Implementations
*/