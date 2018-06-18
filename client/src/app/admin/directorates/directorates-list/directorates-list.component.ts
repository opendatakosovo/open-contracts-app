import { Component, OnInit, Input } from '@angular/core';
import { DirectorateService } from '../../../service/directorate.service';
import { Directorates } from '../../../models/directorates';

@Component({
  selector: 'app-directorates-list',
  templateUrl: './directorates-list.component.html',
  styleUrls: ['./directorates-list.component.css']
})
export class DirectoratesListComponent implements OnInit {
  @Input() directorates: Directorates;

  constructor() { }

  ngOnInit() {
  }

}
