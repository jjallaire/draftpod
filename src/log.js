
/* eslint-disable */ 

import * as Sentry from '@sentry/browser';

const production = process.env.NODE_ENV === 'production';

export function logException(error, tag) {
  console.log(tag + ": " + error);
  if (production) {
    Sentry.withScope(scope => {
      if (tag)
        scope.setTag("tag", tag);
      Sentry.captureException(error);
    });
  }
}

export function logMessage(message) {
  console.log(message);
  if (production)
    Sentry.captureMessage(message);

}

