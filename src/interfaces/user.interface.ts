export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date | null;
  role: string;
  image?: string | null;
}
