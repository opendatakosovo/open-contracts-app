export class DirectorateData {
  totalDirectorates: number;
  totalInactiveDirectorates: number;
  totalActiveDirectorates: number;
  totalDirectoratesWithoutPeopleInCharge: number;
  totalDirectoratesWithPeopleInCharge: number;

  constructor() {
    this.totalDirectorates = 0;
    this.totalInactiveDirectorates = 0;
    this.totalActiveDirectorates = 0;
    this.totalDirectoratesWithoutPeopleInCharge = 0;
    this.totalDirectoratesWithPeopleInCharge = 0;
  }
}
