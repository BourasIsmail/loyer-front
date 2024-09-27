import { Proprietaire } from "./Proprietaire";
import { Province } from "./Province";

export type Local = {
  id?: number;
  proprietaires?: Proprietaire[];
  adresse?: string;
  brutMensuel?: number;
  contrat?: File;
  province?: Province;
};
