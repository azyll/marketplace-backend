export function getStartAndEndOfMonth() {
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)); // last moment of month
  return {startOfMonth, endOfMonth};
}

export function getStartAndEndOfTheYear() {
  const now = new Date();
  const startOfTheYear = new Date(now.getFullYear(), 0, 1);
  const endOfTheYear = new Date(now.getFullYear(), 12, 0, 23, 59, 59, 999); // last moment of month
  return {startOfTheYear, endOfTheYear};
}

export function parseDateAsUTC(dateString, endTime = false) {
  const [month, day, year] = dateString.split('-');
  const months = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11
  };

  const monthIndex = months[month.toLowerCase()];
  return endTime ?
      new Date(Date.UTC(year, monthIndex, day, 23, 59, 59, 999))
    : new Date(Date.UTC(year, monthIndex, day));
}

