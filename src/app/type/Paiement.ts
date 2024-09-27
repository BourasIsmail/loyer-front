import { Local } from "./Local";

export type Paiement = {
  id?: number;
  dateCreation?: string;
  month?: number;
  year?: number;
  bruteMensuel?: number;
  pourcentageRAS?: number;
  ras?: number;
  netMensuel?: number;
  etat?: string;
  local?: Local;
};
