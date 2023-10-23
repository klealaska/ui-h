import { AxiosError } from 'axios';
import { ITenantError } from '../../controllers';
import { generalObjectMapper } from '@ui-coe/shared/bff/util';

export function tenantErrorMapper(err): ITenantError {
  return generalObjectMapper<AxiosError, ITenantError>(err, {
    message: 'message',
    code: 'code',
    status: 'response.status',
    statusText: 'response.statusText',
    data: 'response.data',
  });
}
