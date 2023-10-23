import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppConfig } from '../../../assets/config/app.config.model';
import { appConfigStub } from '../../../test/test-stubs';
import { Execution } from '../../models';
import { SyncService } from './sync.service';

describe('SyncService', () => {
  let service: SyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AppConfig, useValue: appConfigStub }],
    });
    service = TestBed.inject(SyncService);
    TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('postExecution', () => {
    it('should make an http post request', () => {
      jest.spyOn(service.http, 'post').mockReturnValue(of());
      service.postExecution({});
      expect(service.http.post).toHaveBeenCalled();
    });
  });

  describe('postFileUpload', () => {
    it('should make an http post request', () => {
      jest.spyOn(service.http, 'post').mockReturnValue(of());
      service.postFileUpload('custKey', 'platKey', {} as File);
      expect(service.http.post).toHaveBeenCalled();
    });
  });
});
