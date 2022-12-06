import { BillItem } from './bill-item.model';

export interface Bill {
  title: string;
  items: BillItem[];
}
