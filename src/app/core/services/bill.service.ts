import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CryptoService } from '.';
import { Bill, BillItem } from '../models';

const LS_BILL = 'bp-bill';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private bill = new BehaviorSubject<Bill>({
    title: '',
    items: [],
  });

  private bill$ = this.bill.asObservable();

  get billStorage(): Bill {
    if (isDevMode()) {
      return JSON.parse(localStorage.getItem(LS_BILL) || '{}');
    }

    return JSON.parse(
      this.cryptoService.decrypt(localStorage.getItem(LS_BILL) || '') || '{}',
    );
  }

  set billStorage(bill: Bill) {
    if (isDevMode()) {
      localStorage.setItem(LS_BILL, JSON.stringify(bill));
    } else {
      localStorage.setItem(
        LS_BILL,
        this.cryptoService.encrypt(JSON.stringify(bill)),
      );
    }
  }

  constructor(private cryptoService: CryptoService) {
    if (Object.keys(this.billStorage).length > 0) {
      this.bill.next(this.billStorage);
    }
    this.bill$.subscribe((bill) => {
      this.billStorage = bill;
    });
  }

  getBillTitle(): Observable<string> {
    return this.bill$.pipe(map((bill) => bill.title));
  }

  updateBillTitle(title: string) {
    const bill = this.billStorage;
    bill.title = title;
    this.bill.next(bill);
  }

  getBillItems(): Observable<BillItem[]> {
    return this.bill$.pipe(map((bill) => bill.items));
  }

  getBillItem(id: string): Observable<BillItem | undefined> {
    return this.bill$.pipe(
      map((bill) => bill.items.find((item) => item.id === id)),
    );
  }

  createBillItem(item: BillItem) {
    const bill = this.billStorage;
    bill.items.push(item);
    this.bill.next(bill);
  }

  updateBillItem(item: BillItem) {
    const bill = this.billStorage;
    const index = bill.items.findIndex((i) => i.id === item.id);
    bill.items[index] = item;
    this.bill.next(bill);
  }

  deleteBillItem(id: string) {
    const bill = this.billStorage;
    bill.items = bill.items.filter((item) => item.id !== id);
    this.bill.next(bill);
  }

  deleteBillItems(ids: string[]) {
    const bill = this.billStorage;
    bill.items = bill.items.filter((item) => !ids.includes(item.id));
    this.bill.next(bill);
  }

  deleteAllBillItems() {
    const bill = this.billStorage;
    bill.items = [];
    this.bill.next(bill);
  }
}
