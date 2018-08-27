import { Injectable } from "@angular/core";
import { UserService } from "../service/user.service";
import { CheckIfServerDown } from "./CheckIfServerDown";
import { Router } from "@angular/router";

@Injectable()
export class CheckIfUserIsActive {

    constructor(private userService: UserService, 
                private checkIfServerDown: CheckIfServerDown,
                private router: Router) {}

    check() {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    this.userService.isActive(currentUser.id)
      .subscribe(data => {
        if(!data){
         this.userService.logout(); 
         this.router.navigate(['/login']);
        }
      }, err => {
          this.checkIfServerDown.check(err.status)
      });
    }
}