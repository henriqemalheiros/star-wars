export default (value) => (
  typeof value === 'string'
    ? value.replace(/[^.\d]/g, '')
    : value
);
