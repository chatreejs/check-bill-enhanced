import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

import { Observable, Observer, take } from 'rxjs';

import { BillService } from '../services';

export class BillItemValidator {
  static validateName(billService: BillService, id: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        billService
          .getBillItemByName(control.value)
          .pipe(take(1))
          .subscribe((item) => {
            if (item && item.id !== id) {
              observer.next({ duplicated: true });
            } else {
              observer.next(null);
            }
            observer.complete();
          });
      });
  }
}
