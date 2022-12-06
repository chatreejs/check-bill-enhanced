import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BillService } from 'src/app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  billName: string = '';
  billNameChanged: Subject<string> = new Subject<string>();

  get buttonDisabled(): boolean {
    return false;
  }

  constructor(private router: Router, private billService: BillService) {}

  ngOnInit(): void {
    this.billService.getBillTitle().subscribe((value) => {
      this.billName = value;
    });
  }

  updateBillName(value: string) {
    this.billService.updateBillTitle(value);
  }

  next() {
    this.router.navigate(['bill']);
  }
}
