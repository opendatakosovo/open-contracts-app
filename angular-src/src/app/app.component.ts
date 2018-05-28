import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  navCondition(){
    var url = window.location.href;
    var lastSlash = url.lastIndexOf("/");
    var value = url.substring(lastSlash+1)
    if(value == 'login'){
      return false;
    }
    return true;
  }
  
}
