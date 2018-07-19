export class Comment {
    _id?: string;
    userId: string;
    comment: string;
    contractId: string;
    dateTime: string;
    reply?: [{
        userId: string,
        replyComment: string,
        dateTime: string
    }];
    constructor() {
        this._id = '';
        this.userId = '';
        this.comment = '';
        this.contractId = '';
        this.dateTime = '';
        this.reply = [{
            userId: null,
            replyComment: null,
            dateTime: null
        }];
}
}
