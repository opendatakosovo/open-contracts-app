import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { DataService } from '../../service/data.service';
import { Chart } from 'angular-highcharts';
import { UserData } from './UserData';
import { DirectorateData } from './DirectorateData';
import { ContractData } from './ContractData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  userData: UserData;
  directorateData: DirectorateData;
  contractData: ContractData;
  usersByDirectoratesChart: Chart;
  usersByRolesChart: Chart;
  directoratesByStatusChart: Chart;
  contractsByFlagStatusChart: Chart;

  constructor(public dataService: DataService) {
    this.userData = new UserData();
    this.directorateData = new DirectorateData();
    this.contractData = new ContractData();
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

    this.dataService.getDirectorateData()
        .takeUntil(this.unsubscribeAll)
        .subscribe(directorateDataRes => {
          this.directorateData = directorateDataRes;
          this.renderDirectoratesByStatusChart(this.directorateData.totalActiveDirectorates, this.directorateData.totalInactiveDirectorates);
        }, err => {
          console.log(err);
        });

    this.dataService.getContractsData()
      .takeUntil(this.unsubscribeAll)
      .subscribe(contractDataRes => {
        this.contractData = contractDataRes;
        this.renderContractsByFlagStatusChart(this.contractData.totalContractsWithoutFlagStatus, this.contractData.totalPendingContracts, this.contractData.totalCompletedContracts, this.contractData.totalRefusedContracts);
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
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Numri i përdoruesve'
        }
      },
      series: [{
        name: 'Numri',
        color: '#17a2b8',
        data: [{
            name: 'Pa drejtori',
            y: totalUsersWithoutDirectorate,
            color: '#17a2b8'
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
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Numri i përdoruesve'
        }
      },
      series: [{
        name: 'Roli',
        data: [{
          name: 'Administratorë',
          y: totalAdminUsers,
          color: '#353a40'
        }, {
          name: 'Të thjeshtë',
          y: totalSimpleUsers,
          color: '#17a2b8'
        }]
      }]
    });
  }

  renderDirectoratesByStatusChart(totalActiveDirectorates: number, totalInactiveDirectorates: number): void {
    this.directoratesByStatusChart = new Chart({
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Numri i drejtorive sipas statusit'
      },
      xAxis: {
        type: 'category'
      },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Numri'
        }
      },
      series: [{
        name: 'Statusi',
        data: [{
            name: 'Aktive',
            y: totalActiveDirectorates,
            color: '#353a40'
          }, {
            name: 'Jo Aktive',
            y: totalInactiveDirectorates,
            color: '#17a2b8'
          }
        ]
      }]
    });
  }

  renderContractsByFlagStatusChart(totalContractsWithoutFlagStatus, totalPendingContracts, totalCompletedContracts, totalRefusedContracts): void {
    this.contractsByFlagStatusChart = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Numri i kontratave sipas statusit të përfundimit'
      },
      xAxis: {
        type: 'category'
      },
      legend: {
        enabled: false
      },
      yAxis: {
        title: {
          text: 'Numri'
        }
      },
      series: [{
        name: 'Statusi',
        data: [{
            name: 'Pa status',
            y: totalContractsWithoutFlagStatus,
            color: '#17a2b8'
          }, {
            name: 'Pezull',
            y: totalPendingContracts
          }, {
            name: 'Përfunduar me sukses',
            y: totalCompletedContracts
          }, {
            name: 'E refuzuar',
            y: totalRefusedContracts
          }
        ]
      }]
    });
  }
}
