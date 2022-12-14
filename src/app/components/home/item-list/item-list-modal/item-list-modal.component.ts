import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import {
  BillItem,
  markAllControlsAsDirty,
  ModalType,
  updateAllControlValueAndValidity,
} from 'src/app/core';

import { v4 as uuidv4 } from 'uuid';

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

  constructor(private modal: NzModalRef, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.itemListForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
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
    // Mock data
    // TODO: Use NgRx to get data from store
    const mockData: BillItem = {
      id: uuidv4(),
      name: 'น้ำแข็ง',
      quantity: 2,
      price: 60,
    };
    this.itemListForm.patchValue({
      id: mockData.id,
      name: mockData.name,
      quantity: mockData.quantity,
      price: mockData.price,
    });
  }

  saveItem(): void {
    if (this.itemListForm.valid) {
      if (this.type === ModalType.Create) {
        this.itemListForm.controls['id'].setValue(uuidv4());
        console.log('submit:: Create', this.itemListForm.value);
        this.modal.close();
      } else {
        console.log('submit:: Update', this.itemListForm.value);
        this.modal.close();
      }
    } else {
      markAllControlsAsDirty([this.itemListForm]);
      updateAllControlValueAndValidity([this.itemListForm]);
    }
  }

  deleteItem(): void {
    console.log('delete');
    this.modal.close();
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
