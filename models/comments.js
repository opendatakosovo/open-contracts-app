const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("../config/database");
const skipEmpty = require("mongoose-skip-empty");

// Directorate Schema
const CommentSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    comment: { type: String },
    contractId: { type: String },
    dateTime: { type: String },
    reply: [{
        replyUserId: { type: mongoose.Schema.Types.ObjectId },
        replyComment: { type: String },
        replyDateTime: { type: String }
    }]
});
const Comment = (module.exports = mongoose.model("Comment", CommentSchema));

module.exports = mongoose.model("Comment", CommentSchema);

// Method for adding a comment
module.exports.addComment = (newComment) => {
    return newComment.save();
}

// Method for adding a reply
module.exports.addReply = (commentId, reply, callback) => {
    Comment.update(
        { "_id": commentId },
        { "$push": { "reply": reply } },
        callback);
}

// Method for deleting a comment 
module.exports.deleteComment = (commentId, callback) => {
    Comment.findByIdAndRemove(commentId, callback);
}

// Method for deleting a reply
module.exports.deleteReply = (commentId, replyId, callback) => {
    Comment.update({
        "_id": commentId
    },
        {
            "$pull":
                {
                    "reply":
                        { "_id": replyId }
                }
        }, callback);
}

// Method for getting a contract id 
module.exports.getComments = (contractId, callback) => {
    Comment.aggregate([
        { "$match": { "contractId": contractId } },
        { "$sort": { "dateTime": -1}},
        {
            "$project": {
                "userId": 1,
                "comment": 1,
                "contractId": 1,
                "dateTime": 1,
                "reply": { "$ifNull": ["$reply", []] }
            }
        },
        {
            "$unwind": {
                "path": "$reply",
                "preserveNullAndEmptyArrays": true
            }
        },
        { "$sort": { "reply.replydateTime": 1}},
        {
            "$lookup": {
                "from": "users",
                "localField": "reply.replyUserId",
                "foreignField": "_id",
                "as": "result"
            }
        },
        {
            "$project": { "result": { "_id": 0 } }
        },
        {
            "$unwind": {
                "path": "$result",
                "preserveNullAndEmptyArrays": true
            }
        },
        {
            "$project": {
                "userId": 1, "comment": 1, "contractId": 1, "dateTime": 1, "result": { "$ifNull": ["$result", []] },
                "repliesWithPeople": { "$mergeObjects": ["$reply", "$result"] }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "person"
            }
        }, {
            "$replaceRoot": { "newRoot": { "$mergeObjects": [{ "$arrayElemAt": ["$person", 0] }, "$$ROOT"] } }
        },
        {
            "$group": {
                "_id": "$_id",
                "firstName": { "$first": "$firstName" },
                "lastName": { "$first": "$lastName" },
                "role": { "$first": "$role" },
                "isActive": { "$first": "$isActive" },
                "userId": { "$first": "$userId" },
                "dateTime": { "$first": "$dateTime" },
                "comment": { "$first": "$comment" },
                "contractId": { "$first": "$contractId" },
                "reply": { "$push": "$repliesWithPeople" }
            }
        }
    ], callback);

}