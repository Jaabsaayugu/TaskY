export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
  isDeleted: boolean;
  dateJoined: string;
  lastUpdate: string;
}
