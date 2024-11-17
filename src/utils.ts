import { v4 as uuidv4 } from "uuid";

export const now = (): Date => {
  return new Date();
};

export const generateUUID = () => {
  return uuidv4();
};
