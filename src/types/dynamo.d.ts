interface UserConnectionRecord {
  id: string; // event.requestContext > connectionId
  pk: string; // connection#${userId}
  sk: string; // event.requestContext > connectionId

  userName: string;
  userId: string;
  domainName: string;
  stage: string;
}
interface MonthRecord {
  id: string; // year-month eg 2022-11
  ownerId: string; // owner
  groupName: string; // 'November 2022'
}

interface EntryRecord {
  id: string;
  pk: string;
  sk: string;

  type: string; // expense, income, transfer
  category: string; // food, rent, car, etc
  amount: number; // 20.00 - use regex to enforce period or comma for decimals
  month: string; // eg 2022-11
  TTL: string; // due date
  note: string;
}
