import { Injectable } from '@angular/core';
import { ConfidenceThreshold } from '@ui-coe/avidcapture/shared/types';

@Injectable({
  providedIn: 'root',
})
export class ConfidenceColorAssociationService {
  getConfidenceColor(value: number, threshold: ConfidenceThreshold): string {
    if (!value && !threshold) {
      return 'default';
    }
    switch (true) {
      case value >= threshold?.high.min:
        return 'green';
      case value >= threshold?.medium.min:
        return 'yellow';
      case value >= threshold?.low.min:
        return 'red';
      default:
        return 'default';
    }
  }
}
