export class Comment {
    _id?: string;
    userId: string;
    comment: string;
    contractId: string;
    dateTime: string;
    reply?: {
        replyUserId: string,
        replyComment: string,
        replyDateTime: string
    };
    constructor() {
        this._id = '';
        this.userId = '';
        this.comment = '';
        this.contractId = '';
        this.dateTime = '';
        this.reply = {
            replyUserId: null,
            replyComment: null,
            replyDateTime: null
        };
}
}
