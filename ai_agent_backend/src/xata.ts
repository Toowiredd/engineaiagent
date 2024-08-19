import { XataClient } from '@xata.io/client';

const xata = new XataClient({
  apiKey: 'YOUR_API_KEY'
});

export const getXataClient = () => xata;
