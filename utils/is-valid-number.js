export default (value) => {
  const number = Number(value);
  return !Number.isNaN(number) && Number.isFinite(number);
};
