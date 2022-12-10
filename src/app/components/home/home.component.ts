import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BillService } from 'src/app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  billName: string = '';

  private subscription!: Subscription;

  get buttonDisabled(): boolean {
    return false;
  }

  constructor(private router: Router, private billService: BillService) {}

  ngOnInit(): void {
    this.subscription = this.billService.getBillTitle().subscribe((value) => {
      this.billName = value;
    });
  }

  updateBillName(value: string) {
    this.billService.updateBillTitle(value);
  }

  next() {
    this.router.navigate(['bill']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
