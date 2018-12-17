
/* eslint-disable */ 

import * as Sentry from '@sentry/browser';

const production = process.env.NODE_ENV === 'production';

export function logException(error) {
  console.log(error);
  if (production)
    Sentry.captureException(error);
}

export function logMessage(message) {
  console.log(message);
  if (production)
    Sentry.captureMessage(message);

}

