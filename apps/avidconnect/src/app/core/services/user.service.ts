import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { UserProfile } from '../../models';
import { AuthService } from '@ui-coe/shared/util/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private authService: AuthService) {}

  getProfile(): Observable<UserProfile> {
    const userAccount = this.authService.getUserInfo();
    if (userAccount) {
      const userProfile: UserProfile = {
        businessPhones: [],
        displayName: userAccount.preferred_username,
        givenName: userAccount.preferred_username,
        id: userAccount.sub,
        jobTitle: '',
        mail: userAccount.email,
        mobilePhone: '',
        officeLocation: '',
        preferredLanguage: '',
        surname: userAccount.family_name,
        userPrincipalName: userAccount.email,
      };
      return of(userProfile);
    }
    return of({} as UserProfile);
  }
}
