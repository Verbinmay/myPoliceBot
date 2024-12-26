export type AdminsDBModel = {
  admins: Array<AdminDB>;
  chat_id: number;
};

export type AdminDB = {
  user_name: string;
  user_id: number;
};
