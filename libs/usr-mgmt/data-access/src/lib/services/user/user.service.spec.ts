import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { cold } from 'jasmine-marbles';

import { IListWrapper } from '@ui-coe/shared/types';
import { ConfigService } from '@ui-coe/shared/util/services';
import { IUser, UserStatus } from '@ui-coe/usr-mgmt/shared/types';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpClient: HttpClient;

  const id = '00u98v1wp5ONavBDt1d8';

  const user: IUser = {
    userId: id,
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    username: 'johndoe@example.com',
    userType: 'External',
    status: UserStatus.INACTIVE,
    createdTimestamp: '2021-10-03T12: 22: 13Z',
    createdByActorId: 'v1df1c37h7tp8u5dhzvn',
    lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
    lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
  };

  const userList: IListWrapper<IUser> = {
    itemsRequested: 1,
    itemsReturned: 1,
    itemsTotal: 1,
    offset: 0,
    items: [user],
  };

  const body = {
    firstName: 'Rob',
    lastName: 'Smith',
    email: 'mail@mail.com',
    username: 'mail@mail.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mockURL'),
          },
        },
      ],
    });
    service = TestBed.inject(UserService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be call getUsers', () => {
    const response = cold('a', { a: userList });
    const expected = cold('a', { a: userList });
    jest.spyOn(httpClient, 'get').mockReturnValue(response);

    expect(service.getUsers()).toBeObservable(expected);
  });

  it('should call createUser', () => {
    const response = cold('a', { a: user });
    const expected = cold('a', { a: user });
    jest.spyOn(httpClient, 'post').mockReturnValue(response);

    expect(service.createUser(body)).toBeObservable(expected);
  });

  it('should call editUser', () => {
    const response = cold('a', { a: user });
    const expected = cold('a', { a: user });
    jest.spyOn(httpClient, 'patch').mockReturnValue(response);

    expect(service.editUser(id, body)).toBeObservable(expected);
  });
});
