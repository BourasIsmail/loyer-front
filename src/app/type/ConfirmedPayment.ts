import { Local } from "./Local";

export type ConfirmedPayment = {
  id?: number;
  date?: Date;
  mois?: number;
  year?: number;
  moisAnnee?: string;
  local?: Local;
};
