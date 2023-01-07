import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

import { Observable, Observer, take } from 'rxjs';

import { BillService } from '../services';

export class PayerValidator {
  static validateName(billService: BillService, id?: string): AsyncValidatorFn {
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
}
