const router = require("express").Router();
const Comment = require('../../models/comments');
const passport = require("passport");
const Users = require("../../models/user");
const commentValidation = require("../../middlewares/comment_validation");
const sendEmailNotifications = require("../../utils/sendEmailNotifications");

// Route for adding a comment
router.post('/', passport.authenticate('jwt', { session: false }), commentValidation, (req, res) => {

    let comment = new Comment({
        userId: req.body.userId,
        comment: req.body.comment,
        contractId: req.body.contractId,
        dateTime: req.body.dateTime,
    });

    Comment.addComment(comment)
        .then(cm => {

            let enableEmailNotification = req.query.enableEmailNotification == "true" ? true : false;
            if (enableEmailNotification) {
                const usersEmails = req.body.usersEmails;
                Users.getAllAdminUsers()
                    .then(adus => {
                        
                        sendEmailNotifications(adus, usersEmails, req.body.userFullName, req.body.contractId, req.headers.origin)
                            .then(result => {
                                return res.json({
                                    "msg": "Comment has been added successfully, and notifications by email has been sent!",
                                    "comment": cm,
                                    "success": true
                                });
                            }).catch(err => {
                                return res.json({
                                    "err": err,
                                    "success": false
                                });
                            });
                    }).catch(err => {
                        console.log(err);
                        return res.json({
                            "err": err,
                            "success": false
                        });
                    });
            } else {
                return res.json({
                    "msg": "Comment has been added successfully!",
                    "comment": cm,
                    "success": true
                });
            }
        }).catch(err =>{
            return res.json({
                "err": err,
                "success": false
            });
        })
});

// Route for adding a reply
router.post('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let reply = new Comment ({
        reply: {
        replyUserId: req.body.reply.replyUserId,
        replyComment: req.body.reply.replyComment,
        replyDateTime: req.body.reply.replyDateTime
        }
    });
    
    Comment.addReply(req.params.id, reply.reply , (err, response) => {
        if(!err) {
            let enableEmailNotification = req.query.enableEmailNotification == "true" ? true : false;
            if (enableEmailNotification) {
                const usersEmails = req.body.usersEmails;
                console.log(usersEmails);
                Users.getAllAdminUsers()
                    .then(adus => {
                        sendEmailNotifications(adus, usersEmails, req.body.userFullName, req.body.contractId, req.headers.origin)
                            .then(result => {
                                return res.json({
                                    "msg": "Reply has been added successfully, and notifications by email has been sent!",
                                    "comment": response,
                                    "success": true
                                });
                            }).catch(err => {
                                return res.json({
                                    "err": err,
                                    "success": false
                                });
                            });
                    }).catch(err => {
                        return res.json({
                            "err": err,
                            "success": false
                        });
                    });
            } else {
                res.json({
                    "msg": "Reply has been added successfully!",
                    "response": response,
                    "success": true
                })
            }
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Route for getting all comments, replies and the users that added them
router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Comment.getComments(req.params.id, (err, comments) => {
        
        if(!err) {
            res.json({
                "msg": "Comments have been retrieved successfully",
                "comments": comments,
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Route for deleting a comment with all its replies
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req,res) => {
    Comment.deleteComment(req.params.id, (err, response) => {
        if(!err) {
            res.json({
                "msg": "Comment has been deleted successfully!",
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

// Route for deleting a reply
router.delete('/delete-reply/:commentId/:replyId',  (req,res) => {

    Comment.deleteReply(req.params.commentId, req.params.replyId, (err, response) => {
        if(!err) {
            res.json({
                "msg": "Reply has been deleted successfully!",
                "success": true
            });
        } else {
            res.json({
                "err": err,
                "success": false
            });
        }
    });
});

module.exports = router;
