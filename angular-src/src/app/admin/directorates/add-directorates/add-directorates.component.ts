import { Component, OnInit } from '@angular/core';
import { Directorates } from '../../../models/directorates';


@Component({
  selector: 'app-add-directorates',
  templateUrl: './add-directorates.component.html',
  styleUrls: ['./add-directorates.component.css']
})
export class AddDirectoratesComponent implements OnInit {

  directorate: Directorates = {
    directorate: ''
  };

  constructor() { }

  ngOnInit() {
  }

  addDirectorate() {
    return;
  }
}
