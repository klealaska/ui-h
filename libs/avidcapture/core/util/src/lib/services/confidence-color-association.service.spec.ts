import { TestBed } from '@angular/core/testing';

import { ConfidenceColorAssociationService } from './confidence-color-association.service';

describe('ConfidenceColorAssociationService', () => {
  let service: ConfidenceColorAssociationService;
  const ConfidenceThreshold = {
    high: {
      min: 95,
    },
    medium: {
      min: 90,
    },
    low: {
      min: 0,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfidenceColorAssociationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('getConfidenceColor()', () => {
    describe('when value is >= 95', () => {
      it('should return color as green', () =>
        expect(service.getConfidenceColor(99.99, ConfidenceThreshold)).toBe('green'));
    });

    describe('when value is >= 90 && < 95', () => {
      it('should return color as yellow', () =>
        expect(service.getConfidenceColor(91, ConfidenceThreshold)).toBe('yellow'));
    });

    describe('when value is <= 89', () => {
      it('should return color as red', () =>
        expect(service.getConfidenceColor(75, ConfidenceThreshold)).toBe('red'));
    });

    describe('when no value is given', () => {
      it('should return color as default', () =>
        expect(service.getConfidenceColor(undefined, ConfidenceThreshold)).toBe('default'));
    });

    describe('when a value is given but threshold is null', () => {
      it('should return color as default', () =>
        expect(service.getConfidenceColor(99.99, null)).toBe('default'));
    });

    describe('when no value and no confidence threshold is given', () => {
      it('should return color as default', () =>
        expect(service.getConfidenceColor(undefined, undefined)).toBe('default'));
    });
  });
});
