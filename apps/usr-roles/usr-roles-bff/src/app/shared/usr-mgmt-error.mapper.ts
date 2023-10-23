import { AxiosError } from 'axios';
import { camelCaseObjectKeys, generalObjectMapper } from '@ui-coe/shared/bff/util';
import { UserRolesError } from '../models';

export function userRolesErrorMapper(err): UserRolesError {
  return camelCaseObjectKeys(
    generalObjectMapper<AxiosError, UserRolesError>(err, {
      message: 'message',
      code: 'code',
      status: 'response.status',
      statusText: 'response.statusText',
      data: 'response.data',
    })
  );
}
