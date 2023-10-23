import { AxiosError } from 'axios';
import { UserManagementError } from '../models';
import { camelCaseObjectKeys, generalObjectMapper } from '@ui-coe/shared/bff/util';

export function userManagementErrorMapper(err): UserManagementError {
  return camelCaseObjectKeys(
    generalObjectMapper<AxiosError, UserManagementError>(err, {
      message: 'message',
      code: 'code',
      status: 'response.status',
      statusText: 'response.statusText',
      data: 'response.data',
    })
  );
}
