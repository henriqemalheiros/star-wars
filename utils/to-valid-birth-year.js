import toValidNumber from './to-valid-number';
import stringToNumber from './string-to-number';

export default (value) => (
  toValidNumber(stringToNumber(value)) * (value.endsWith('ABY') ? -1 : 1)
);
