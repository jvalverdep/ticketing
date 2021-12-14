export const validate = {
  isOnlyNumbers: (value) => {
    return RegExp(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/).test(value);
  },
};
