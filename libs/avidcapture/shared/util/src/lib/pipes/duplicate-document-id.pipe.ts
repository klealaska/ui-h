import { Pipe, PipeTransform } from '@angular/core';
import { DuplicateDetectionError } from '@ui-coe/avidcapture/shared/types';

@Pipe({
  name: 'duplicateDocumentId',
})
export class DuplicateDocumentIdPipe implements PipeTransform {
  transform(value: string, sourceId = false): string {
    return sourceId
      ? (JSON.parse(value) as DuplicateDetectionError).sourceDocumentId
      : (JSON.parse(value) as DuplicateDetectionError).documentId;
  }
}
