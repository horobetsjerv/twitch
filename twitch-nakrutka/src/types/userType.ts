enum Roles {
  USER = "USER",
  WORKER = "WORKER",
  ADMIN = "ADMIN",
  NULL = "NULL",
}

export interface UserIF {
  id: string;
  login: string;
  role: Roles[];
}
