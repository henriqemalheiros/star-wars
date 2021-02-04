import isValidNumber from './is-valid-number';

export default (value) => (
  isValidNumber(value)
    ? Number(value)
    : 0
);
