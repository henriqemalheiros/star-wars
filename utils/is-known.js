export default (value) => (
  typeof value === 'string'
  && value.length
  && value !== 'unknown'
);
