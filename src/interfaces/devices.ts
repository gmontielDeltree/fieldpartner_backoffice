import { Document } from '../types';

export interface PublicDevices extends Document {
    code: string
    descriptionES: string;
    descriptionPT: string;
    descriptionEN: string;
    language: string;
    currency: string;
    taxKey: string;
    taxKeyFormat: string;
}