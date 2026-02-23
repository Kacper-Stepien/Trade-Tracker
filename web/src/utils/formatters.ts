export const formatPrice = (
  value: number | null,
  locale: string,
  emptyValue: string = "-",
) => {
  if (value === null) {
    return emptyValue;
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (
  value: string | null,
  locale: string,
  emptyValue: string = "-",
) => {
  if (!value) {
    return emptyValue;
  }

  return new Date(value).toLocaleDateString(locale);
};
