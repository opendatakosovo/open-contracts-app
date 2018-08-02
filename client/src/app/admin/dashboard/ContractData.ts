export class ContractData {
  totalContracts: number;
  totalContractsWithoutFlagStatus: number;
  totalPendingContracts: number;
  totalCompletedContracts: number;
  totalRefusedContracts: number;

  constructor() {
    this.totalContracts = 0;
    this.totalContractsWithoutFlagStatus = 0;
    this.totalPendingContracts = 0;
    this.totalCompletedContracts = 0;
    this.totalRefusedContracts = 0;
  }
}
