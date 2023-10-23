import { Injector } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { IFailureProps, ISuccessProps } from '@ui-coe/shared/types';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

export abstract class AxBaseFacade {
  private actions$;

  constructor(private parentInjector: Injector) {
    this.actions$ = this.parentInjector.get(Actions);
  }

  /**
   *
   * @param T1 The typed result of the expected object to be returned via the success action. For example,
   *  this could be IOrganization if we were attempting to create or update an organization.
   * @param successAction The ActionCreator associated with the expected success action. For example, this
   *   could be ICreateOrganizationSuccess.
   * @param failureAction The ActionCreator associated with the expected failure action. For example, this
   *   could be ICreateOrganizationFailure.
   * @param correlationId The ID utilized to correlate the initiating action with a success or failure.
   * @throws An error containing the message dispatched within associated failure action payload.
   * @returns The expected object contained within the associated successful action payload.
   */
  getResultAfterResolveOrReject<T1>(
    successAction,
    failureAction,
    correlationId: string
  ): Observable<T1> {
    return this.actions$.pipe(
      ofType(successAction, failureAction),
      filter((action: ISuccessProps<T1> | IFailureProps) => action.correlationId === correlationId),
      map((action: ISuccessProps<T1> | IFailureProps): T1 => {
        if ((<IFailureProps>action).error) {
          throw new Error((<IFailureProps>action).error.message);
        }

        return <T1>(<unknown>(<ISuccessProps<T1>>action).response);
      })
    );
  }
}
