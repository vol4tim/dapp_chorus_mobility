import * as utils from './utils';

export const fromWei = (amount, decimals, currency = null) => {
  return `${utils.fromWei(amount, decimals)} ${(currency) ? currency : ''}`;
};
