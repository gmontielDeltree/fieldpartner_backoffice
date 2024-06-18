import { Document, UserDto } from "../types";

export interface Customer extends Document {
    id: string;
    accountID: string;
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
    creationDate: string;
    observation: string;
    user: UserDto;
}
