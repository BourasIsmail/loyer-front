import { Province } from "./Province";

export type UserInfo = {
  id?: number;
  name?: string;
  email?: string;
  roles?: string;
  password?: string;
  province?: Province;
};
