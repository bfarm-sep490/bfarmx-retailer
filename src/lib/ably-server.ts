'use server';

import { liveProvider } from '@refinedev/ably';
import { ablyClient } from './ablyClient';

export const getLiveProvider = async () => {
  return liveProvider(ablyClient);
};
