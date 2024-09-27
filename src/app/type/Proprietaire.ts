import { Province } from "./Province";

export type Proprietaire = {
  id?: number;
  nom?: string;
  prenom?: string;
  cin?: string;
  telephone?: string;
  adresse?: string;
  rib?: string;
  province?: Province;
};
