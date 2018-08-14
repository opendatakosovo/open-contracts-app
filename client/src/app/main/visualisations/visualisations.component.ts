import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-visualisations',
  templateUrl: './visualisations.component.html',
  styleUrls: ['./visualisations.component.css']
})
export class VisualisationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.addEventListener('language', function () {
      // do your checks to detect
      // changes in "e1", "e2" & "e3" here
      console.log('changed');
  }, false);
  }

}
