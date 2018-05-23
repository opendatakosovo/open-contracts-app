import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  click1:boolean = true;
  click2:boolean = false;
  click3:boolean = false;
  click4:boolean = false;
  text:string ="nav-link text-dark";
  constructor() { }
  
  ngOnInit() {
  }

   onClick(link){
     console.log(link)

    if(link=="home"){
       this.click1=true;
       this.click2=false;
       this.click3=false;
       this.click4=false;
       
     }
    else if (link=="visualizations")
      {
       this.click1=false;
       this.click2=true;
       this.click3=false;
       this.click4=false;
       
      } 
    if (link=="dataSet")
      {
          this.click1=false;
          this.click2=false;
          this.click3=true;
          this.click4=false;
          
      }
    else if(link=="aboutUs") {
      this.click1=false;
      this.click2=false;
      this.click3=false;
      this.click4=true;
      
      }
    
   }
    
}

