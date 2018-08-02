import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { DataService } from '../../service/data.service';
import { Chart } from 'angular-highcharts';
import { UserData } from './UserData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  userData: UserData;
  usersByDirectoratesChart: Chart;
  usersByRolesChart: Chart;

  constructor(public dataService: DataService) {
    this.userData = new UserData();
  }

  ngOnInit() {
    this.dataService.getUserData()
      .takeUntil(this.unsubscribeAll)
      .subscribe(userDataRes => {
        this.userData = userDataRes;

        this.renderUsersByDirectoratesChart(this.userData.totalUsersWithoutDirectorate, this.userData.totalUsersWithDirectorate);
        this.renderUsersByRoleChart(this.userData.totalAdminUsers, this.userData.totalSimpleUsers);
      }, err => {
        console.log(err);
      });
  }

  renderUsersByDirectoratesChart(totalUsersWithoutDirectorate: number, totalUsersWithDirectorate: number): void {
    this.usersByDirectoratesChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Numri i përdoruesve të thjeshtë aktiv në bazë të drejtorive'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Numri i përdoruesve'
        }
      },
      series: [{
        name: 'Numri',
        data: [{
            name: 'Pa drejtori',
            y: totalUsersWithoutDirectorate
          }, {
            name: 'Me drejtori',
            y: totalUsersWithDirectorate
          }
        ]
      }]
    });
  }

  renderUsersByRoleChart(totalAdminUsers: number, totalSimpleUsers: number): void {
    this.usersByRolesChart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Numri i përdoruesve në bazë të roleve'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Numri i përdoruesve'
        }
      },
      series: [{
        name: 'Numri',
        data: [{
          name: 'Administratorë',
          y: totalAdminUsers
        }, {
          name: 'Të thjeshtë',
          y: totalSimpleUsers
        }]
      }]
    });
  }

}
