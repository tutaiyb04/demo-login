/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export const toChecked = (value: any): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') {
    if (Array.isArray(value.selected)) return value.selected.length > 0;
    if (Array.isArray(value.value)) return value.value.length > 0;
    return Object.keys(value).length > 0;
  }
  if (typeof value === 'string') return value.trim() !== '' && value !== '[]';
  return Boolean(value);
};
