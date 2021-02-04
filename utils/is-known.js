export default (value) => (
  typeof value === 'string'
  && value.trim().length
  && value.trim().toLowerCase() !== 'unknown'
);
