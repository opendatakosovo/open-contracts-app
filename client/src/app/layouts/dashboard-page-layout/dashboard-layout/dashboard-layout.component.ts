import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';
import { Title } from '@angular/platform-browser';
import { User } from '../../../models/user';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  modalRef: BsModalRef;
  private unsubscribeAll: Subject<any> = new Subject<any>();
  currentUser: User;
  constructor(
    private userService: UserService,
    private router: Router, private translate: TranslateService, private modalService: BsModalService, private titleService: Title
  ) {
    this.translate.get('pageTitle')
      .takeUntil(this.unsubscribeAll)
      .subscribe(name => {
        this.titleService.setTitle(name);
      });
    this.currentUser = JSON.parse(localStorage.getItem('user'));
  }

  ngOnInit() {
  }

  authorize() {
    if (this.currentUser.role !== 'superadmin' && this.currentUser.role !== 'admin') {
      return false;
    }
    return true;
  }
  logOutModal(template) {
    this.modalRef = this.modalService.show(template);
  }
  onLogout() {
    this.userService.logout();
    this.router.navigate(['/login']);
    this.modalRef.hide();
    return false;
  }

}
