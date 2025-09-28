export const formatDateForSql = (date: Date) => {
  return date.toISOString().replace("T", " ").replace("Z", "");
};
