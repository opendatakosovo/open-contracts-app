const router = require("express").Router();
const Comment = require('../../models/comments');
const passport = require("passport");
const Users = require("../../models/user");
const commentValidation = require("../../middlewares/comment_validation");

//Route for adding a comment
router.post('/', passport.authenticate('jwt', { session: false }), commentValidation, (req, res) => {
    let comment = new Comment({
        userId: req.body.userId,
        comment: req.body.comment,
        contractId: req.body.contractId,
        dateTime: req.body.dateTime,
    });
    Comment.addComment(comment, (err, comment) => {       
        if (!err) {
            res.json({
                "msg": "Comment has been added succesfully!",
                "comment": comment,
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

// Route for adding a reply
router.post('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let reply = new Comment ({
        reply : {
        replyUserId: req.body.replyUserId,
        replyComment: req.body.replyComment,
        replyDateTime: req.body.replyDateTime
        }
    })
    
    Comment.addReply(req.params.id, reply.reply , (err, response) => {
        if(!err) {
            res.json({
                "msg": "Reply has been added succesfully!",
                "response": response,
                "success": true
            })
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
                "msg": "Comments have been retrived succesfully",
                "comments": comments,
                "succes": true
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
                "msg": "Comment has been deleted succesfully!",
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
router.delete('/delete-reply/:commentId', passport.authenticate('jwt', { session: false }), (req,res) => {
    Comment.deleteReply(req.params.commentId, req.body.replyId, (err, response) => {
        if(!err) {
            res.json({
                "msg": "reply has been deleted succesfully!",
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
