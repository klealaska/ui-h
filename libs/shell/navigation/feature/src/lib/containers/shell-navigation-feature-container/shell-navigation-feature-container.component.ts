import { Component, OnInit } from '@angular/core';
import { ContentFacade } from '@ui-coe/shared/data-access/content';
import { NavItem } from '@ui-coe/shared/types';
import { AuthFacade } from '@ui-coe/shell/navigation/data-access';
import { Observable, filter, map } from 'rxjs';

@Component({
  selector: 'ui-coe-shell-navigation-feature-container',
  templateUrl: './shell-navigation-feature-container.component.html',
  styleUrls: ['./shell-navigation-feature-container.component.scss'],
})
export class ShellNavigationFeatureContainerComponent implements OnInit {
  constructor(private authFacade: AuthFacade, private contentFacade: ContentFacade) {}
  // Variable which feeds the sidenav component data requirements
  content$: Observable<NavItem[]> = this.contentFacade.navData$.pipe(
    map(dataArr => {
      const navItemsFromCms = [];
      for (const data of dataArr) {
        navItemsFromCms.push({
          displayName: data?.displayName,
          iconName: 'cloud',
          imageUrl: data?.imageUrl,
          route: data?.route,
          children: [],
        });
      }
      return navItemsFromCms;
    })
  );
  // Variable which feeds the topnav component data requirements
  headerContent$: Observable<NavItem> = this.contentFacade.getContentById('0').pipe(
    filter(data => !!data),
    map(data => {
      return {
        displayName: data.attributes?.displayName,
        imageUrl: data.attributes?.imageUrl,
        route: data.attributes?.route,
      };
    })
  );

  /**
   * This is temp data once we have profile api, we would fetch this from there
   */
  avatarInput = {
    size: 'md',
    img: 'https://mdbcdn.b-cdn.net/img/new/avatars/8.webp',
    name: {
      first: 'hari',
      last: 'kumar',
    },
  };

  ngOnInit(): void {
    this.authFacade.loadAuthToken();
  }

  signOut() {
    this.authFacade.signOut();
  }
}
