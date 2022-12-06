import { BillItem } from './bill-item.model';
import { Payer } from './payer.model';

export interface Bill {
  title: string;
  items: BillItem[];
  payers: Payer[];
}
