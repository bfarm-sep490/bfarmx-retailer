'use client';

import { API_URL } from '@/constants';
import { dataProviderRest } from '@/rest-data-provider';

export const dataProvider = dataProviderRest(API_URL);
