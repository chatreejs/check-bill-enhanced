import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, Observer, take } from 'rxjs';
import { BillService } from '../services';

export class PayerValidator {
  static validateName(billService: BillService, id: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        billService
          .getBillPayerByName(control.value)
          .pipe(take(1))
          .subscribe((payer) => {
            if (payer && payer.id !== id) {
              observer.next({ duplicated: true });
            } else {
              observer.next(null);
            }
            observer.complete();
          });
      });
  }

  static validateChildrenName(
    billService: BillService,
    parentId: string,
    childrenId?: string,
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        billService
          .getBillPayerChildren(parentId)
          .pipe(take(1))
          .subscribe((children) => {
            if (children) {
              const child = children.find(
                (child) => child.name === control.value,
              );
              if (child && child.id !== childrenId) {
                observer.next({ duplicated: true });
              } else {
                observer.next(null);
              }
            }
            observer.complete();
          });
      });
  }
}
