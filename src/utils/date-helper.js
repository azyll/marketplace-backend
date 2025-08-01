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

export function getDateStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
export function getDateAndTimeStamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${hours}${minutes}${seconds}${year}${month}${day}`;
}

