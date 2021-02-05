import capitalize from 'lodash.capitalize';

import isKnown from './is-known';

export default (value) => (
  isKnown(value)
    ? capitalize(value)
    : undefined
);
