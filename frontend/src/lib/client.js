import ApolloClient from 'apollo-boost';
import { endpoint, prodEndpoint } from '../config';

console.log('\x1b[31m', 'process.env.', process.env, '\x1b[0m');

export const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,
  request: operation => {
    operation.setContext({
      fetchOptions: {
        credentials: 'include'
      }
    });
  }
});
