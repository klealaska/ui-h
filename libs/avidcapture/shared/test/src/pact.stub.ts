import { PactOptions } from '@pact-foundation/pact';
import * as path from 'path';

export function getPactConfig(provider: string): PactOptions {
  return {
    log: path.resolve(process.cwd(), 'pact', 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pact'),
    consumer: 'xdc-indexer',
    provider,
  };
}
