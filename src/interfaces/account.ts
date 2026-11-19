import { Document, UserDto } from "../types";

export interface LicenceSummary {
    id: string;
    status: string;
    licenceTypeId: string;
    licenceTypeLabel: string;
    startDate: string;
    endDate: string;
    amountLicencesAllowed: number | null;
}

export class AccountDto {
    id: string = '';
    denomination: string = '';
    countryCode: string = '';
    category: string = '';
    status: string = '';
    isLicenceMultipleCountry: boolean = false;
    countFields: number = 0;
    countLicences: number = 0;
    countHectares: number = 0;
    licence: LicenceSummary | null = null;
}

export interface Account extends Document {
    licenceNumber: string;
    accountId?: string;
    denomination: string;
    country: string;
    status: string;
    category: string;
    startDateLicence: string;
    endDateLicence: string;
    licenceType: string;
    licence: string;
    amountLicencesAllowed: number;
    isLicenceMultipleCountry: boolean;
    fantasyName: string;
    trybutaryCode: string;
    companyLogo: string;
    zipCode: string;
    phone: string;
    socialReason: string;
    secondaryContact?: string;
    website: string;
    address: string;
    locality: string;
    province: string;
    // creationDate: string;
    observation: string;
    user: UserDto | null;
    countCampos?: number;
    countLicencias?: number;
    countHectareas?: number;
    associateUser: boolean;
    emailToAssociate: string;
    companyEmail: string;
    userLanguage: string;
    activeUsersAllowed: number;
    maxHectares: number;
}


export interface UpdateAccount {
    status?: string;
    isLicenceMultipleCountry?: boolean;
}