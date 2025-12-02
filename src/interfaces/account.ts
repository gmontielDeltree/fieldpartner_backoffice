import { Document, UserDto } from "../types";

export interface Account extends Document {
    accountReference: string;
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
}


export interface UpdateAccount {
    isLicenceMultipleCountry?: boolean;
    status?: string;
    startDateLicence?: string;
    endDateLicence?: string;
}