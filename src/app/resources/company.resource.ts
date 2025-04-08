import { Company } from '../models/company.model';
import { createResource } from '../core/factories/resource-api.factory';
import { InjectionToken } from '@angular/core';
import { Resource } from '../core/factories/resource-api.factory';

export const COMPANY_RESOURCE = new InjectionToken<Resource<Company>>('CompanyResource');

export const provideCompanyResource = () => createResource<Company>(COMPANY_RESOURCE, '/companies');
