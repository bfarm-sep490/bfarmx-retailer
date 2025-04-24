import { Ably } from '@refinedev/ably';

const apiKey = process.env.NEXT_PUBLIC_ABLY_API_KEY || 'ably_api_key';
if (!apiKey) {
  throw new Error('ABLY_API_KEY is not defined');
}

export const ablyClient = new Ably.Realtime(apiKey);
