export interface Organization {
  id: number;
  publicId: string;
  name: string;
  email: string;
  phone: string;
  color: string;
  logo: string | null;
  stripeAccountId: string;
  stripeAccountActive: boolean;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}
