import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpConfigService } from '../../../services/http-config.service';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';

describe('OrganizationController', () => {
  let controller: OrganizationController;
  let organizationService: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [OrganizationController],
      providers: [
        OrganizationService,
        HttpConfigService,
        ConfigService,
        { provide: 'MOCK_ENV', useValue: true },
      ],
    }).compile();

    controller = module.get<OrganizationController>(OrganizationController);
    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call getOrganizations', () => {
    jest.spyOn(organizationService, 'getOrganizations').mockImplementation();
    controller.getOrganizations({}, {});
    expect(organizationService.getOrganizations).toHaveBeenCalled();
  });

  it('should call getOrganizationById', () => {
    jest.spyOn(organizationService, 'getOrganizationById').mockImplementation();
    controller.getOrganizationById('111', {});
    expect(organizationService.getOrganizationById).toHaveBeenCalled();
  });

  it('should call createOrganization', () => {
    jest.spyOn(organizationService, 'createOrganization').mockImplementation();
    controller.createOrganization({}, {} as any);
    expect(organizationService.createOrganization).toHaveBeenCalled();
  });

  it('should call updateOrganization', () => {
    jest.spyOn(organizationService, 'updateOrganization').mockImplementation();
    const id = '111';
    controller.updateOrganization(id, {}, {} as any);
    expect(organizationService.updateOrganization).toHaveBeenCalled();
  });

  it('should call activateOrganization', () => {
    jest.spyOn(organizationService, 'activateOrganization').mockImplementation();
    const id = '111';
    controller.activateOrganization(id, {} as any);
    expect(organizationService.activateOrganization).toHaveBeenCalled();
  });

  it('should call deactivateOrganization', () => {
    jest.spyOn(organizationService, 'deactivateOrganization').mockImplementation();
    const id = '111';
    controller.deactivateOrganization(id, {} as any);
    expect(organizationService.deactivateOrganization).toHaveBeenCalled();
  });

  it('should call updateOrganizationAddress', () => {
    jest.spyOn(organizationService, 'updateOrganizationAddress').mockImplementation();
    controller.updateOrganizationAddress('123', '234', {} as any, {} as any);
    expect(organizationService.updateOrganizationAddress).toHaveBeenCalled();
  });

  it('should call activateOrganizationAddress', () => {
    jest.spyOn(organizationService, 'activateOrganizationAddress').mockImplementation();
    controller.activateOrganizationAddress('123', '234', {} as any);
    expect(organizationService.activateOrganizationAddress).toHaveBeenCalled();
  });

  it('should call deactivateOrganizationAddress', () => {
    jest.spyOn(organizationService, 'deactivateOrganizationAddress').mockImplementation();
    controller.deactivateOrganizationAddress('123', '234', {} as any);
    expect(organizationService.deactivateOrganizationAddress).toHaveBeenCalled();
  });
});
