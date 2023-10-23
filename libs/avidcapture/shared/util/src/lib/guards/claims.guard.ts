import { Injectable } from '@angular/core';
import { Route, Router, UrlSegment } from '@angular/router';
import {
  AppPages,
  UserDocumentPermissions,
  UserPermissions,
  UserQueuePermissions,
  UserRoles,
} from '@ui-coe/avidcapture/shared/types';
import { AuthService } from '@ui-coe/shared/util/auth';
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClaimsGuard {
  constructor(private router: Router, private authService: AuthService) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    const token = this.authService.getAccessToken();
    const decodedToken = token && jwt_decode(token);
    let result = false;

    if (!this.hasClaims(decodedToken) && route.path === AppPages.Archive && segments.length === 2) {
      return of(true);
    } else if (!this.hasClaims(decodedToken) && route.path !== AppPages.ErrorPage) {
      this.router.navigate([AppPages.ErrorPage]);
      return of(false);
    }

    switch (route.path) {
      case AppPages.RecycleBin:
        result = decodedToken[UserPermissions.RecycleBin] ? true : false;
        break;
      case AppPages.Dashboard:
        result = decodedToken[UserPermissions.Dashboard] ? true : false;
        break;

      case AppPages.Queue:
        result = decodedToken[UserPermissions.Pending] ? true : false;
        break;
      case AppPages.Archive:
        result = decodedToken[UserPermissions.Archive] ? true : false;
        break;
      case AppPages.UploadsQueue:
        result = decodedToken[UserPermissions.Upload] ? true : false;
        break;
      case AppPages.Research:
        result = decodedToken[UserPermissions.Research] ? true : false;
        break;
      case AppPages.ErrorPage:
        result = !this.hasClaims(decodedToken) && route.path === AppPages.ErrorPage ? true : false;
        break;
    }

    if (!result && decodedToken[UserPermissions.Pending]) {
      this.router.navigate([AppPages.Queue]);
    } else if (
      !result &&
      decodedToken['roles'].includes(UserRoles.UploadAndSubmit) &&
      !decodedToken['roles'].includes(UserRoles.GlobalExceptionManager) &&
      !decodedToken['roles'].includes(UserRoles.AllPerms)
    ) {
      if (
        route.path?.toLowerCase().indexOf(AppPages.Archive.toLowerCase()) >= 0 &&
        segments.length === 2
      ) {
        return of(true);
      }

      this.router.navigate([AppPages.UploadsQueue]);
    } else if (
      !result &&
      !decodedToken[UserPermissions.Pending] &&
      route.path !== AppPages.Dashboard
    ) {
      this.router.navigate([AppPages.Dashboard]);
    }
    return of(result);
  }

  private hasClaims(decodedToken): boolean {
    let hasClaims = false;
    const claims = { ...UserQueuePermissions, Upload: UserDocumentPermissions.Upload };
    Object.entries(claims).forEach((claim: [string, string]) => {
      if (decodedToken[claim[1]]) {
        hasClaims = true;
      }
    });
    return hasClaims;
  }
}
