import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, combineLatestWith, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as UserActions from './user.actions';
import { IGetToastOptions, IListWrapper, ToastIcon, ToastTypeEnum } from '@ui-coe/shared/types';
import { UserService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { getToasterConfig } from '@ui-coe/shared/util/interfaces';
import { ContentKeys, ICreateEditUser, IUser, ToastContent } from '@ui-coe/usr-mgmt/shared/types';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private translateService: TranslateService
  ) {}

  loadUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() => {
        return this.userService.getUsers().pipe(
          map((response: IListWrapper<IUser>) =>
            UserActions.loadUsersSuccess({ response: response.items })
          ),
          catchError(error => of(UserActions.loadUsersFailure({ error })))
        );
      })
    );
  });

  addUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.addUser),
      switchMap(({ body, toastContent }: { body: ICreateEditUser; toastContent: ToastContent }) => {
        return this.userService.createUser(body).pipe(
          map((response: IUser) => {
            return UserActions.addUserSuccess({
              response,
              toastSuccessText: toastContent.toastSuccessText,
            });
          }),
          catchError(error =>
            of(
              UserActions.addUserFailure({ error, toastFailureText: toastContent.toastFailureText })
            )
          )
        );
      })
    );
  });

  editUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.editUser),
      switchMap(
        ({
          id,
          body,
          toastContent,
        }: {
          id: string;
          body: ICreateEditUser;
          toastContent: ToastContent;
        }) => {
          return this.userService.editUser(id, body).pipe(
            map((response: IUser) =>
              UserActions.editUserSuccess({
                response,
                toastSuccessText: toastContent.toastSuccessText,
              })
            ),
            catchError(error =>
              of(
                UserActions.editUserFailure({
                  error,
                  toastFailureText: toastContent.toastFailureText,
                })
              )
            )
          );
        }
      )
    );
  });

  deactivateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.deactivateUser),
      switchMap(({ userId }: { userId: string }) => {
        return this.userService.deactivateUser(userId).pipe(
          map((response: IUser) => {
            return UserActions.deactivateUserSuccess({
              response,
            });
          }),
          catchError(error =>
            of(
              UserActions.deactivateUserFailure({
                error,
              })
            )
          )
        );
      })
    );
  });

  displayToast$ = createEffect(() => {
    let toastConfigOptions: IGetToastOptions;

    return this.actions$.pipe(
      ofType(
        UserActions.addUserFailure,
        UserActions.addUserSuccess,
        UserActions.loadUsersFailure,
        UserActions.editUserSuccess,
        UserActions.editUserFailure,
        UserActions.deactivateUserSuccess,
        UserActions.deactivateUserFailure
      ),
      combineLatestWith(
        this.translateService.get([
          ContentKeys.GET_USERS_ERROR_TOAST,
          ContentKeys.USER_DEACTIVATED_SUCCESS_TOAST,
          ContentKeys.USER_DEACTIVATED_FAILURE_TOAST,
        ])
      ),
      switchMap(([action, translation]) => {
        switch (action.type) {
          case UserActions.addUserSuccess.type:
            toastConfigOptions = {
              title: action.toastSuccessText,
            };
            break;
          case UserActions.addUserFailure.type:
            toastConfigOptions = {
              title: action.toastFailureText,
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
          case UserActions.editUserSuccess.type:
            toastConfigOptions = {
              title: action.toastSuccessText,
            };
            break;
          case UserActions.editUserFailure.type:
            toastConfigOptions = {
              title: action.toastFailureText,
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
          case UserActions.loadUsersFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.GET_USERS_ERROR_TOAST],
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
          case UserActions.deactivateUserSuccess.type:
            toastConfigOptions = {
              title: translation[ContentKeys.USER_DEACTIVATED_SUCCESS_TOAST],
              type: ToastTypeEnum.SUCCESS,
              icon: ToastIcon.CHECK_CIRCLE,
            };
            break;
          case UserActions.deactivateUserFailure.type:
            toastConfigOptions = {
              title: translation[ContentKeys.USER_DEACTIVATED_FAILURE_TOAST],
              type: ToastTypeEnum.CRITICAL,
              icon: ToastIcon.ERROR,
            };
            break;
        }
        return of(UserActions.displayToast({ config: getToasterConfig(toastConfigOptions) }));
      })
    );
  });
}
