
interface MonthRecord {
  id: string; // year-month eg 2022-11
  ownerId: string; // owner
  groupName: string; // 'November 2022'
}

interface EntryRecord {
  id: string,
  pk: string;
  sk: string;

  type: string, // expense or income
  category: string, // food, rent, car, etc
  amount: number, // 20.00 - use regex to enforce period or comma for decimals
}