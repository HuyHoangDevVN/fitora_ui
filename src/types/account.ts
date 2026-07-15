export interface Account {
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string;
  status?: number;
  roles?: string[];
}
