import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { ModalType } from 'src/app/core/enums';
import { Payer } from 'src/app/core/models';
import { BillService } from 'src/app/core/services';
import { PayerListModalComponent } from './payer-list-modal/payer-list-modal.component';
@Component({
  selector: 'app-payer-list',
  templateUrl: './payer-list.component.html',
  styleUrls: ['./payer-list.component.scss'],
})
export class PayerListComponent implements OnInit, OnDestroy {
  isShowCheckbox: boolean = false;
  isAllChecked: boolean = false;
  isIndeterminate: boolean = false;
  listOfPayer: Payer[] = [];
  setOfCheckedId: Set<string> = new Set<string>();
  expandSet = new Set<string>();

  private subscription!: Subscription;

  get modalType(): typeof ModalType {
    return ModalType;
  }

  constructor(
    private billService: BillService,
    private modalService: NzModalService,
    private translate: TranslateService,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit(): void {
    this.subscription = this.billService.getBillPayers().subscribe((payer) => {
      this.listOfPayer = payer;
    });
  }

  toggleCheckbox(): void {
    this.isShowCheckbox = !this.isShowCheckbox;
    if (!this.isShowCheckbox) {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
    }
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  refreshCheckedStatus(): void {
    this.isAllChecked = this.listOfPayer.every((item) =>
      this.setOfCheckedId.has(item.id),
    );
    this.isIndeterminate =
      this.listOfPayer.some((item) => this.setOfCheckedId.has(item.id)) &&
      !this.isAllChecked;
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfPayer.forEach((item) => this.updateCheckedSet(item.id, checked));
    this.refreshCheckedStatus();
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  deleteItemList(): void {
    if (this.setOfCheckedId.size === 0) {
      this.billService.deleteAllBillPayers();
    } else {
      this.billService.deleteBillPayers([...this.setOfCheckedId]);
    }
    this.toggleCheckbox();
  }

  openPayerListModal(type: ModalType, id?: string): void {
    this.modalService.create({
      nzTitle: this.translate.instant(
        type === ModalType.Create
          ? 'home.payerList.modal.title.add'
          : 'home.payerList.modal.title.edit',
      ),
      nzContent: PayerListModalComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        type,
        id,
      },
      nzFooter: [
        {
          label: this.translate.instant('common.button.cancel'),
          onClick: (component) => {
            component?.destroyModal();
          },
        },
        {
          label: this.translate.instant('common.button.save'),
          type: 'primary',
          onClick: (component) => {
            component?.savePayer();
          },
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
