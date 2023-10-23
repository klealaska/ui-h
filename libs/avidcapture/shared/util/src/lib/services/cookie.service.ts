import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  getCookie(name: string): string {
    if (this.cookieExists(name)) {
      name = encodeURIComponent(name);

      const regExp: RegExp = this.getCookieRegExp(name);
      const result: RegExpExecArray = regExp.exec(this.document.cookie);

      return result[1] ? this.safeDecodeURIComponent(result[1]) : '';
    } else {
      return '';
    }
  }

  getAllCookies(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    const document: any = this.document;

    if (document.cookie && document.cookie !== '') {
      document.cookie.split(';').forEach(currentCookie => {
        const [cookieName, cookieValue] = currentCookie.split('=');
        cookies[this.safeDecodeURIComponent(cookieName.replace(/^ /, ''))] =
          this.safeDecodeURIComponent(cookieValue);
      });
    }

    return cookies;
  }

  private getCookieRegExp(name: string): RegExp {
    // eslint-disable-next-line no-useless-escape
    const escapedName: string = name.replace(/([\[\]\{\}\(\)\|\=\;\+\?\,\.\*\^\$])/gi, '\\$1');

    return new RegExp(`(?:^${escapedName}|;\\s*${escapedName})=(.*?)(?:;|$)`, 'g');
  }

  private cookieExists(name: string): boolean {
    name = encodeURIComponent(name);
    const regExp: RegExp = this.getCookieRegExp(name);
    return regExp.test(this.document.cookie);
  }

  private safeDecodeURIComponent(encodedURIComponent: string): string {
    try {
      const decodedValue = decodeURIComponent(encodedURIComponent);
      // additional security check to prevent XSS
      const regex = /^[a-zA-Z0-9]{0,400}$/;
      if (regex.test(decodedValue)) {
        return decodedValue;
      } else {
        return '';
      }
    } catch {
      // probably it is not uri encoded. return as is
      return encodedURIComponent;
    }
  }
}
