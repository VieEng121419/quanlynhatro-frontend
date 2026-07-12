import { ContractData } from "@/components/contracts/view-contract-modal";

export const DEFAULT_CONTRACT: ContractData = {
  id: null,
  roomId: null,
  tenantName: "",
  tenantPhone: "",
  startDate: "",
  endDate: "",
  rentPrice: 0,
  depositAmount: 0,
  billingCycleDay: 1,
  activePeopleCount: 0,
  basePeopleLimit: 0,
  extraPersonFee: 0,
  isActive: false,
};
