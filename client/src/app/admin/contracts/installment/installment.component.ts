import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-installment',
  templateUrl: './installment.component.html',
  styleUrls: ['./installment.component.css']
})
export class InstallmentComponent implements OnInit {
  @Input() counter: number;
  constructor() {

  }
  ngOnInit() {
  }
}
