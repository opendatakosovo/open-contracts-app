export class Party {
    identifier?: {
        scheme?: String,
        id?: String,
        legalName?: String,
        uri?: String
    };
    name?: String;
    address?: {
        streetAddress?: String,
        locality?: String,
        region?: String,
        postalCode?: String,
        countryName?: String
    };
    contactPoint?: {
        name?: String,
        email?: String,
        telephone?: String,
        faxNumber?: String,
        url?: String
    };
    roles?: String[];
    id?: String;
    details?: {
        local?: Boolean
    };

    constructor() {
        this.identifier = {
            scheme: '',
            id: '',
            legalName: '',
            uri: ''
        };
        this.name = '';
        this.address = {
            streetAddress: '',
            locality: '',
            region: '',
            postalCode: '',
            countryName: ''
        };
        this.contactPoint = {
            name: '',
            email: '',
            telephone: '',
            faxNumber: '',
            url: ''
        };
        this.roles = [];
        this.id = '';
        this.details = {
            local: null
        };
    }
}
