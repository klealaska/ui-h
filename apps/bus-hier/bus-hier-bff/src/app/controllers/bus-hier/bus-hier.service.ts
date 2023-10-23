import { Injectable } from '@nestjs/common';
import { EMPTY, Observable, expand, forkJoin, map, mergeMap, of, reduce, switchMap } from 'rxjs';
import { range, unset } from 'lodash';
import { IGenericStringObject } from '@ui-coe/shared/bff/types';
import { BusHierCountService } from './bus-hier-count';
import { businessLevelMapper, navEntityMapper, responseObjectMapper } from './bus-hier-nav.mapper';
import { ErpService } from '../erp';
import { OrganizationService } from '../organization';
import { BusinessLevelService } from '../business-level';
import { EntityService } from '../entity';
import {
  BusinessHierarchyBusinessLevel,
  BusinessHierarchyCount,
  BusinessHierarchyList,
  BusinessHierarchyListOrgObject,
  BusinessHierarchyNav,
  BusinessLevelMappedList,
  EntityList,
  EntityMapped,
  Erp,
  ErpList,
  ErpMapped,
  IBusinessHierarchyNavData,
  Organization,
  OrganizationList,
  OrganizationMapped,
} from '../models';

@Injectable()
export class BusHierService {
  constructor(
    private busLevService: BusinessLevelService,
    private countService: BusHierCountService,
    private erpService: ErpService,
    private orgService: OrganizationService,
    private entityService: EntityService
  ) {}

  /**
   * @method getList
   * @description creates a list of orgs and ERPs, linking the ERPs to their respective orgs
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<BusinessHierarchyList>`
   */
  getBusHierList(
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<BusinessHierarchyList> {
    const orgErpListObj: BusinessHierarchyList = {
      organizations: null,
      erps: null,
    };
    return this.orgService.getOrganizations(headers, query).pipe(
      mergeMap((orgList: OrganizationList) => {
        orgErpListObj.organizations = orgList.items.map((item: OrganizationMapped) => ({
          ...item,
          erps: [],
        }));
        return orgList?.items.length
          ? forkJoin(
              orgList.items.map((item: OrganizationMapped) =>
                this.erpService.getErps(item.organizationId, headers, query)
              )
            )
          : of([]);
      }),
      map((erps: ErpList[]) => {
        orgErpListObj.erps = erps.flatMap((erp: ErpList) => erp.items);
        orgErpListObj.organizations.forEach((org: BusinessHierarchyListOrgObject) => {
          org.erps = orgErpListObj.erps
            .filter((erp: ErpMapped) => erp.organizationId === org.organizationId)
            .map((erp: ErpMapped) => erp.erpId);
        });

        return orgErpListObj;
      })
    );
  }

  /**
   * @method getBusHierNav
   * @description Generates the business hierarchy navigation object
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<BusinessHierarchyNav>`
   */
  getBusHierNav(
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<BusinessHierarchyNav> {
    const { orgId, erpId, entityId } = query;

    //* passing in `limit=100` here to make sure we get all business levels in one call
    //* we will need to revisit this if there is ever a case where an erp has more than
    //* 100 business levels.
    const strippedQuery: IGenericStringObject = { ...query, limit: '100' };
    ['orgId', 'erpId', 'entityId'].forEach(key => unset(strippedQuery, key));

    return this.getBusHierNavData(orgId, erpId, entityId, headers, strippedQuery).pipe(
      switchMap((data: IBusinessHierarchyNavData) => {
        const {
          navData,
          navData: { organization, erp, businessLevel },
          entityData: { numberOfCurrentSelectedEntityChildLevels, currentSelectedEntity },
        } = data;

        //* if we don't have an `entityId` this will be an initial draw
        //* and no further processing needs to be done
        //* so we will just return `navData` here
        if (!entityId) {
          return of(navData);
        }

        //* for tree redraws, we will need to get any parent and child data for the `entityId`
        //* and include that in the returned `BusinessHierarchyNav` object
        return forkJoin([
          this.getBusHierNavEntityParentData(
            currentSelectedEntity.entityId,
            headers,
            strippedQuery
          ),
          this.getBusHierNavChildLevelCount(
            erpId,
            currentSelectedEntity.entityId,
            numberOfCurrentSelectedEntityChildLevels,
            headers,
            strippedQuery
          ),
        ]).pipe(
          map(
            ([parentData, childEntities]: [
              EntityMapped[],
              { businessLevel: number; count: number }[]
            ]) => {
              const businessLevelForCurrentlySelectedEntity: BusinessHierarchyBusinessLevel =
                businessLevel.businessLevels.find(
                  (busLev: BusinessHierarchyBusinessLevel) =>
                    busLev.level === currentSelectedEntity.businessLevel
                );

              businessLevelForCurrentlySelectedEntity.selectedEntity =
                navEntityMapper(currentSelectedEntity);

              if (parentData.length > 1) {
                businessLevel.businessLevels.forEach((busLev: BusinessHierarchyBusinessLevel) => {
                  if (!busLev.selectedEntity) {
                    const blEnt: EntityMapped = parentData.find(
                      (ent: EntityMapped) => ent.businessLevel === busLev.level
                    );

                    busLev.selectedEntity = blEnt ? navEntityMapper(blEnt) : null;
                  }
                });
              }

              childEntities.forEach((ent: { businessLevel: number; count: number }) => {
                if (ent?.count) {
                  const savedBL: BusinessHierarchyBusinessLevel = businessLevel.businessLevels.find(
                    (busLev: BusinessHierarchyBusinessLevel) => busLev.level === ent.businessLevel
                  );
                  savedBL.count = ent.count;
                }
              });

              businessLevel.businessLevels.forEach((busLev: BusinessHierarchyBusinessLevel) => {
                if (busLev.selectedEntity) {
                  busLev.count = 1;
                }
              });

              return { organization, erp, businessLevel };
            }
          )
        );
      })
    );
  }

  /**
   * @method getBusHierNavData
   * @description gets the data needed to construct the object for building the tree
   * @param orgId string
   * @param erpId string
   * @param entityId string
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<IBusinessHierarchyNavData>`
   */
  private getBusHierNavData(
    orgId: string,
    erpId: string,
    entityId: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<IBusinessHierarchyNavData> {
    const obsArr: Observable<any>[] = [
      this.countService.getBusinessHierarchyCount(headers),
      this.orgService.getOrganizationById(orgId, headers),
      this.erpService.getErpById(erpId, headers),
      this.busLevService.getBusinessLevelsByErpId(erpId, headers, query),
    ];

    if (entityId) {
      obsArr.push(this.entityService.getAllChildEntities(entityId, erpId, headers, query));
    }

    return forkJoin(obsArr).pipe(
      map(
        ([count, org, erp, businessLevel, entity]: [
          BusinessHierarchyCount,
          Organization,
          Erp,
          BusinessLevelMappedList,
          EntityList
        ]) => {
          const bhNavData: IBusinessHierarchyNavData = {
            navData: null,
            entityData: {
              currentSelectedEntity: null,
              numberOfCurrentSelectedEntityChildLevels: 0,
            },
          };

          const mappedResponse: BusinessHierarchyNav = responseObjectMapper({
            count,
            org,
            erp,
          });

          const numEntities: BusinessHierarchyBusinessLevel[] = businessLevelMapper(
            businessLevel.items,
            (count as BusinessHierarchyCount).numberOfEntitiesByBusinessLevel
          );

          mappedResponse.businessLevel.businessLevels = numEntities;

          bhNavData.navData = mappedResponse;

          if (entityId) {
            //* `getAllChildEntities returns a list of entities that are the children of the given `entityId`
            //* the zeroeth element in that list is always the entity data for the given `entityId` itself
            //* if that ever changes, we will need to refactor this
            const currentSelectedEntity: EntityMapped = (entity as EntityList).items[0];
            const numberOfCurrentSelectedEntityChildLevels: number =
              businessLevel.itemsTotal - currentSelectedEntity.businessLevel;

            bhNavData.entityData.currentSelectedEntity = currentSelectedEntity;
            bhNavData.entityData.numberOfCurrentSelectedEntityChildLevels =
              numberOfCurrentSelectedEntityChildLevels;
          }

          return bhNavData;
        }
      )
    );
  }

  /**
   * @method getBusHierNavChildLevelCount
   * @description `GET`s all the entity counts for each child level of the given `entityId`
   * @param erpId string
   * @param entityId string
   * @param numChildLevels number
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns `Observable<{ businessLevel: number; count: number }[]>`
   */
  private getBusHierNavChildLevelCount(
    erpId: string,
    entityId: string,
    numChildLevels: number,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<{ businessLevel: number; count: number }[]> {
    //* if there are no child levels for the given `entityId`
    //* we don't need to make any calls and
    //* we will simply return `Observable<[]>` here
    if (!numChildLevels) {
      return of([]);
    }

    //* here we are using `range` to construct an array of numbers
    //* representing the child levels of the given `entityId`
    //* `range` takes a starting value (here 1)
    //* and constructs an array up to but not including the end value (so we add 1 - i.e. numChildLevels + 1)
    //* we then `map` over that array and create an array of observables for `forkJoin` representing a call to
    //* `getChildEntitiesByChildLevel` for each level
    //* we then `map` the results to the desired shape we will return
    return forkJoin(
      range(1, numChildLevels + 1).map((level: number) => {
        return this.entityService.getChildEntitiesByChildLevel(
          entityId,
          erpId,
          `${level}`,
          headers,
          query
        );
      })
    ).pipe(
      map((entListArr: EntityList[]) => {
        return entListArr.map((el: EntityList) => ({
          businessLevel: el.items[0]?.businessLevel,
          count: el.itemsTotal,
        }));
      })
    );
  }

  /**
   * @method getBusHierNavEntityParentData
   * @description `GET`s the entity data for each parent entity of given `entityId`
   *              and accumulates it into an array of mapped entities
   * @param entityId string
   * @param headers IGenericStringObject
   * @param query IGenericStringObject
   * @returns Observable<EntityMapped[]>
   */
  private getBusHierNavEntityParentData(
    entityId: string,
    headers: IGenericStringObject,
    query: IGenericStringObject
  ): Observable<EntityMapped[]> {
    //* this makes the call to get the entity data of the given `entityId`
    //* it will then keep calling to get the entity data using the `parentEntityId` returned by the previous call
    //* until `parentEntityId` comes back as `null`
    //* it will then reduce all entities into an array
    return this.entityService.getEntityByEntityId(entityId, headers, query).pipe(
      expand((data: EntityMapped) => {
        return data.parentEntityId
          ? this.entityService.getEntityByEntityId(data.parentEntityId, headers, query)
          : EMPTY;
      }),
      reduce((acc: EntityMapped[], data: EntityMapped) => acc.concat(data), [])
    );
  }
}
