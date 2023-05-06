/**
 * @api {Function} Reactium.Utils.abbreviatedNumber(number) Utils.abbreviatedNumber()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName Utils.abbreviatedNumber
 * @apiDescription Abbreviate a long number to a string.
 * @apiParam {Number} number The number to abbreviate.
 * @apiExample Example Usage:
Reactium.Utils.abbreviatedNumber(5000);
// Returns: 5k

Reactium.Utils.abbreviatedNumber(500000);
// Returns .5m
 */
export const abbreviatedNumber = (value) => {
  if (!value || value === 0) {
      return;
  }

  const suffixes = ['', 'k', 'm', 'b', 't'];

  let newValue = value;

  if (value >= 1000) {
      const suffixNum = Math.floor(('' + value).length / 3);
      let shortValue = '';

      for (let precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat(
              (suffixNum != 0
                  ? value / Math.pow(1000, suffixNum)
                  : value
              ).toPrecision(precision),
          );
          const dotLessShortValue = (shortValue + '').replace(
              /[^a-zA-Z 0-9]+/g,
              '',
          );
          if (dotLessShortValue.length <= 2) {
              break;
          }
      }

      if (shortValue % 1 != 0) {
          shortValue = shortValue.toFixed(1);
      }
      newValue = shortValue + suffixes[suffixNum];

      newValue = String(newValue).replace('0.', '.');
  }

  return newValue;
};
