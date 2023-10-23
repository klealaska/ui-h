import { AxiosError } from 'axios';
import { IBusHierError } from '../../controllers';
import { generalObjectMapper } from '@ui-coe/shared/bff/util';

export function busHierErrorMapper(err): IBusHierError {
  return generalObjectMapper<AxiosError, IBusHierError>(err, {
    message: 'message',
    code: 'code',
    status: 'response.status',
    statusText: 'response.statusText',
    data: 'response.data',
  });
}
