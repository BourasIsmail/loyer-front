import { Province } from "./Province";
import { Rib } from "./Rib";

export type Proprietaire = {
  id?: number;
  nomComplet?: string;
  cin?: string;
  telephone?: string;
  adresse?: string;
  type?: string;
  rib?: Rib[];
  province?: Province;
};
