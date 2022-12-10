import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { take } from 'rxjs';
import {
  markAllControlsAsDirty,
  ModalType,
  Payer,
  updateAllControlValueAndValidity,
} from 'src/app/core';
import { BillService } from 'src/app/core/services';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-payer-list-modal',
  templateUrl: './payer-list-modal.component.html',
  styleUrls: ['./payer-list-modal.component.scss'],
})
export class PayerListModalComponent implements OnInit {
  @Input() type?: ModalType;
  @Input() id?: string;

  payerListForm!: FormGroup;

  get modalType(): typeof ModalType {
    return ModalType;
  }

  get childrenForm(): FormArray {
    return this.payerListForm.get('childrenForm') as FormArray;
  }

  get hasChildren(): boolean {
    return this.payerListForm.value.hasChildren;
  }

  constructor(
    private modal: NzModalRef,
    private fb: FormBuilder,
    private billService: BillService,
  ) {}

  ngOnInit(): void {
    this.payerListForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      hasChildren: [false],
      childrenForm: this.fb.array([]),
    });
    if (this.type === ModalType.Update) {
      this.initFormData();
    }
  }

  initFormData(): void {
    this.billService
      .getBillPayer(this.id!)
      .pipe(take(1))
      .subscribe((payer) => {
      if (payer) {
        this.payerListForm.patchValue({
          id: payer.id,
          name: payer.name,
          hasChildren: payer.children.length > 0,
        });
        if (payer.children.length > 0) {
          payer.children.forEach((child) => {
            this.childrenForm.push(
              this.fb.group({
                id: [child.id],
                name: [child.name, Validators.required],
              }),
            );
          });
        }
      }
    });
  }

  childrenChange(value: boolean): void {
    if (this.childrenForm.length === 0) {
      this.addChildrenForm();
    }
  }

  addChildrenForm(): void {
    this.childrenForm.push(
      this.fb.group({
        id: [uuidv4()],
        name: ['', Validators.required],
      }),
    );
  }

  removeChildrenForm(index: number): void {
    this.childrenForm.removeAt(index);
  }

  savePayer(): void {
    if (this.payerListForm.valid) {
      const payer: Payer = {
        id: '',
        name: this.payerListForm.value.name,
        children: [],
      };
      if (this.hasChildren) {
        this.childrenForm.value.forEach((child: any) => {
          payer.children.push({
            id: child.id,
            name: child.name,
          });
        });
      }
      if (this.type === ModalType.Create) {
        payer.id = uuidv4();
        this.billService.createBillPayer(payer);
        this.modal.close();
      } else {
        payer.id = this.payerListForm.value.id;
        this.billService.updateBillPayer(payer);
        this.modal.close();
      }
    } else {
      markAllControlsAsDirty([this.payerListForm]);
      updateAllControlValueAndValidity([this.payerListForm]);
    }
  }

  deletePayer(): void {
    this.billService.deleteBillPayer(this.id!);
    this.modal.close();
  }

  destroyModal(): void {
    this.modal.destroy();
  }
}
