export interface Payment{
  idPayment?: any,
  description: string;
  value: number,
  category: string,
  status: string,
  paymentDate: string,
  paymentMethod: string,
  user: string
}
