import { Router } from '@angular/router'
import { UserService } from "../service/user.service";
import { Injectable } from "@angular/core";

@Injectable()
export class CheckIfServerDown {

    constructor(public router: Router, public userService: UserService) {}
    check(status){
        if(status == 0){
            this.userService.logout();
            this.router.navigate(['/login']);
        }
    }
}