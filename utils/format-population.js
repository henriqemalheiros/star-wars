import formatNumber from './format-number';
import isKnown from './is-known';
import isValidNumber from './is-valid-number';
import stringToNumber from './string-to-number';

export default (value) => (
  isKnown(value) && isValidNumber(stringToNumber(value))
    ? `${formatNumber(stringToNumber(value))} inhabitants`
    : undefined
);
