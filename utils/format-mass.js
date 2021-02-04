import isKnown from './is-known';

export default (value) => (
  isKnown(value)
    ? `${value}kg`
    : undefined
);
