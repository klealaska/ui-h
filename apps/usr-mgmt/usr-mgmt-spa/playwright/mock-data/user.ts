export const getUsers = () => ({
  itemsRequested: 100,
  itemsReturned: 1,
  itemsTotal: 1,
  offset: 0,
  items: [
    {
      userId: '00u98v1wp5ONavBDt1d1',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe',
      email: 'johndoe@example.com',
      username: 'foo@bar.com',
      userType: 'External',
      status: 'Active',
      createdTimestamp: '2021-10-03T12: 22: 13Z',
      createdByActorId: 'v1df1c37h7tp8u5dhzvn',
      lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
      lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
    },
  ],
});

export const createUser = () => ({
  userId: '00u98v1wp5ONavBDt333',
  firstName: 'Jane',
  lastName: 'Smithy',
  fullName: 'Jane Smithy',
  email: 'js@mail.com',
  username: 'js@mail.com',
  userType: 'External',
  status: 'Not Invited',
  createdTimestamp: '2021-10-03T12: 22: 13Z',
  createdByActorId: 'v1df1c37h7tp8u5dhzvn',
  lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
  lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
});

export const editUser = () => ({
  userId: '00u98v1wp5ONavBDt1d1',
  firstName: 'Foo',
  lastName: 'Bar',
  fullName: 'Foo Bar',
  email: 'foo@bar.com',
  username: 'foo@bar.com',
  userType: 'External',
  status: 'Not Invited',
  createdTimestamp: '2021-10-03T12: 22: 13Z',
  createdByActorId: 'v1df1c37h7tp8u5dhzvn',
  lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
  lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
});

export const deactivateUser = () => ({
  userId: '00u98v1wp5ONavBDt1d1',
  firstName: 'John',
  lastName: 'Doe',
  fullName: 'John Doe',
  email: 'johndoe@example.com',
  username: 'foo@bar.com',
  userType: 'External',
  status: 'Inactive',
  createdTimestamp: '2021-10-03T12: 22: 13Z',
  createdByActorId: 'v1df1c37h7tp8u5dhzvn',
  lastModifiedTimestamp: '2021-10-06T12: 22: 13Z',
  lastModifiedByActorId: 'qntg26kgs81ey5gtd04n',
});
