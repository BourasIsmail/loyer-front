import { Proprietaire } from "./Proprietaire";
import { Province } from "./Province";

export type Local = {
  id?: number;
  proprietaires?: Proprietaire[];
  adresse?: string;
  brutMensuel?: number;
  rib?: string;
  idContrat?: string;
  etat?: string;
  contrat?: File;
  fileName?: string;
  fileType?: string;
  province?: Province;
};
