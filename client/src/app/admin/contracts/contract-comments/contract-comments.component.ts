import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { User } from '../../../models/user';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { Comment } from '../../../models/comment';
import { UserService } from '../../../service/user.service';
import { CommentService } from '../../../service/comment.service';
import Swal from 'sweetalert2';
import { trigger, style, transition, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { UserNotification } from './UserNotification';

@Component({
  selector: 'app-contract-comments',
  templateUrl: './contract-comments.component.html',
  styleUrls: ['./contract-comments.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ backgroundColor: '#F5F5DC', opacity: 0.5 }),
        animate(1000, style({ backgroundColor: 'white', opacity: 1 }))
      ])
    ]
    )],
})

export class ContractCommentsComponent implements OnInit {
  @ViewChild('commentForm') commentForm: any;
  @ViewChild('commentReplyForm') replyForm: any;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  modalRef: BsModalRef;
  contractId1: string;
  enableEmailNotificationStatus: boolean;
  simpleActiveUsers: UserNotification[];
  users = [];
  loggedInUser = {
    id: '',
    email: ''
  };
  reply = {
    replyUserId: '',
    replyComment: '',
    replyDateTime: ''
  };
  currentUser: User;
  commentModal: Comment;
  comments: Comment[];
  isShown: Array<boolean>;
  replyComment: string;
  commentIsActive: boolean;
  replyIsActive: boolean;


  constructor(
    public userService: UserService,
    public commentService: CommentService,
    private modalService: BsModalService,
    private router: ActivatedRoute,
  ) {
    const id = this.router.snapshot.paramMap.get('id');
    this.contractId1 = id;
    this.users = [];
    this.currentUser = new User;
    this.commentModal = new Comment();
    this.isShown = [];
    this.replyComment = '';
    this.simpleActiveUsers = [];
    this.commentIsActive = true;
    this.replyIsActive = true;
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.commentService.getComments(this.contractId1)
      .takeUntil(this.unsubscribeAll)
      .subscribe(result => {
        if (result !== null) {
          result.forEach(element => {
            this.users.push(element);
            this.isShown.push(false);
          });
          this.users.forEach(element => {
            element.reply.forEach(element1 => {
              if (!element1.hasOwnProperty('_id')) {
                element.reply.splice((element.reply.findIndex(reply => reply === null)), 1);
              }
            });
          });
        }
      });
  }

  ngOnInit() {
    this.enableEmailNotificationStatus = false;
    this.userService.getUserByID(this.loggedInUser.id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        this.currentUser = data;
      });
    this.userService.getAllSimpleActiveUsers()
      .takeUntil(this.unsubscribeAll)
      .subscribe(data => {
        for (const row of data) {
          this.simpleActiveUsers.push({
            name: `${row.firstName} ${row.lastName} (${row.email})`,
            value: row.email,
            checked: false
          });
        }
        this.checkEmailNotificationSettings();
      }, err => {
        console.log(err);
      });
  }

  checkEmailNotificationSettings() {
    const lscms = localStorage.getItem(this.contractId1);
    if (lscms !== null && lscms !== '' && lscms.length > 0) {
      this.enableEmailNotificationStatus = true;
      for (const em of lscms.split(',')) {
        for (const usem of this.simpleActiveUsers) {
          if (em === usem.value) {
            usem.checked = true;
          }
        }
      }
    }
  }

  checkEmailNotification(status) {
    // If email notification is not checked will remove the localStorage state
    const lscms = localStorage.getItem(this.contractId1);
    if (lscms !== null || lscms === '') {
      localStorage.removeItem(this.contractId1);
    }
    this.enableEmailNotificationStatus = false;

    // If email notification is checked will create localStorage state
    if (status) {
      if (lscms === null) {
        localStorage.setItem(this.contractId1, '[]');
      }
      this.enableEmailNotificationStatus = true;
    }
  }

  updateSelectedEmailsState() {
    const slemarr = this.getSelectedUsersEmails();
    const lscms = localStorage.getItem(this.contractId1);
    if (lscms !== null) {
      localStorage.setItem(this.contractId1, slemarr.toString());
    }
  }

  getSelectedUsersEmails() {
    return this.simpleActiveUsers
      .filter(opt => opt['checked'])
      .map(opt => opt['value']);
  }

  commentDeleteModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  replyDeleteModal(template) {
    this.modalRef = this.modalService.show(template);
  }

  show(i) {
    this.isShown[i] = !this.isShown[i];
  }

  addComment(event, isValid) {
    event.preventDefault();
    if (isValid === true) {
      this.commentModal.userId = event.target.dataset.id;
      this.commentModal.contractId = this.contractId1;
      this.commentModal.dateTime = new Date(Date.now()).toLocaleString();
      this.commentModal.userFullName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      const selectedEmails = this.getSelectedUsersEmails();
      if (selectedEmails.length > 0) {
        this.commentModal.usersEmails = selectedEmails;
      }
      if (this.enableEmailNotificationStatus === true) {
        Swal({
          title: 'Duke dërguar njoftimin!',
          onOpen: () => {
            Swal.showLoading();
          }
        });
      }
      this.commentService.addComment(this.commentModal, this.enableEmailNotificationStatus)
        .takeUntil(this.unsubscribeAll)
        .subscribe(res => {
          if (res.err) {
            Swal('Gabim!', 'Komenti nuk u shtua', 'error');
          } else if (res.errVld) {
            let errList = '';
            res.errVld.map(error => {
              errList += `<li>${error.msg}</li>`;
            });
            const htmlData = `<div style="text-align: center;">${errList}</div>`;
            Swal({
              title: 'Kujdes!',
              html: htmlData,
              width: 750,
              type: 'info',
              confirmButtonText: 'Kthehu te forma'
            });
          } else {
            Swal('Sukses!', 'Komenti u shtua me sukses!', 'success');
            this.commentService.getComments(this.contractId1)
              .takeUntil(this.unsubscribeAll)
              .subscribe(result => {
                result.forEach(element => {
                  if (element._id === res.comment._id) {
                    this.users.push(element);
                  }
                  if (!element.reply.hasOwnProperty('_id')) {
                    element.reply.splice((this.users.findIndex(reply => reply === null)), 1);
                  }
                });
              });
            this.commentModal = new Comment();
            this.commentForm.reset();
            this.commentIsActive = false;
            setTimeout(() => this.commentIsActive = true, 0);
          }
        });
    }
  }

  addReply(event, isValid) {
    if (isValid === true) {
      this.commentModal._id = event.target.dataset.id;
      this.reply.replyUserId = this.loggedInUser.id;
      this.reply.replyDateTime = new Date(Date.now()).toLocaleString();
      this.reply.replyComment = this.replyComment;
      this.commentModal.reply = this.reply;
      this.commentModal.userFullName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
      const selectedEmails = this.getSelectedUsersEmails();
      if (selectedEmails.length > 0) {
        this.commentModal.usersEmails = selectedEmails;
      }
      this.commentService.addReply(this.commentModal._id, this.commentModal, this.enableEmailNotificationStatus)
        .takeUntil(this.unsubscribeAll)
        .subscribe(res => {
          if (res.err) {
            Swal('Gabim!', 'Përgjigja nuk u shtua', 'error');
          } else if (res.errVld) {
            let errList = '';
            res.errVld.map(error => {
              errList += `<li>${error.msg}</li>`;
            });
            const htmlData = `<div style="text-align: center;">${errList}</div>`;
            Swal({
              title: 'Kujdes!',
              html: htmlData,
              width: 750,
              type: 'info',
              confirmButtonText: 'Kthehu te forma'
            });
          } else {
            this.userService.getUserByID(this.commentModal.reply.replyUserId).subscribe(data => {
              this.users.forEach(element => {
                if (element._id === this.commentModal._id) {
                  this.commentModal.reply = Object.assign(this.commentModal.reply, data);
                  element.reply.push(this.commentModal.reply);
                }
              });
            });
            this.reply = {
              replyUserId: '',
              replyComment: '',
              replyDateTime: ''
            };
            this.replyComment = '';
            this.replyForm.reset();
            this.replyIsActive = false;
            setTimeout(() => this.replyIsActive = true, 0);
          }
        });
    }
  }

  deleteComment(event) {
    const id = event.target.dataset.id;
    this.commentService.deleteComment(id)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Komenti nuk nuk u fshi', 'error');
        } else {
          this.users.splice((this.users.findIndex(comment => comment._id === id)), 1);
          Swal('Sukses!', 'Komenti u fshi me sukses.', 'success');
          this.modalRef.hide();
        }
      });
  }

  deleteReply(event) {
    const commentId = event.target.dataset.id;
    const replyId = event.target.dataset.replyid;
    this.commentService.deleteReply(commentId, replyId)
      .takeUntil(this.unsubscribeAll)
      .subscribe(res => {
        if (res.err) {
          Swal('Gabim!', 'Reply nuk nuk u fshi', 'error');
        } else {
          this.users.forEach(element => {
            if (element._id === commentId) {
              element.reply.splice((element.reply.findIndex(reply => reply._id === replyId)), 1);
            }
          });
          Swal('Sukses!', 'Përgjigja u fshi me sukses.', 'success');
          this.modalRef.hide();
        }
      });
  }
}
