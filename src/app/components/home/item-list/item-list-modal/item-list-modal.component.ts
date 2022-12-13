import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzModalRef } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
  markAllControlsAsDirty,
  ModalType,
  updateAllControlValueAndValidity,
} from 'src/app/core';
import { BillService } from 'src/app/core/services';
import { BillItemValidator } from 'src/app/core/validators';

@Component({
  selector: 'app-item-list-modal',
  templateUrl: './item-list-modal.component.html',
  styleUrls: ['./item-list-modal.component.scss'],
})
export class ItemListModalComponent implements OnInit {
  @Input() type?: ModalType;
  @Input() id?: string;

  itemListForm!: FormGroup;

  get modalType(): typeof ModalType {
    return ModalType;
  }

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private billService: BillService,
  ) {}

  ngOnInit(): void {
    this.itemListForm = this.fb.group({
      id: [null],
      name: [
        '',
        Validators.required,
        BillItemValidator.validateName(this.billService, this.id!),
      ],
      quantity: [
        null,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      price: [null, Validators.required],
    });
    if (this.type === ModalType.Update) {
      this.initFormData();
    }
  }

  initFormData(): void {
    this.billService
      .getBillItem(this.id!)
      .pipe(take(1))
      .subscribe((item) => {
        if (item) {
          this.itemListForm.patchValue(item);
        }
      });
  }

  saveItem(): void {
    if (this.itemListForm.valid) {
      if (this.type === ModalType.Create) {
        this.itemListForm.controls['id'].setValue(uuidv4());
        this.billService.createBillItem(this.itemListForm.value);
        this.modal.close();
      } else {
        this.billService.updateBillItem(this.itemListForm.value);
        this.modal.close();
      }
    } else {
      markAllControlsAsDirty([this.itemListForm]);
      updateAllControlValueAndValidity([this.itemListForm]);
    }
  }

  deleteItem(): void {
    this.billService.deleteBillItem(this.id!);
    this.modal.close();
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
