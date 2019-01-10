export class Document {
    id?: String;
    documentType?: String;
    title?: String;
    url?: String;
    format?: String;
    language?: String;

    constructor() {
        this.id = '';
        this.documentType = null;
        this.title = '';
        this.url = '';
        this.format = '';
        this.language = '';
    }

}
