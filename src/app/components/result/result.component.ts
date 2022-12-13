import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { BillService } from 'src/app/core/services';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  billTitle$!: Observable<string>;

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.billTitle$ = this.billService.getBillTitle();
  }
}
