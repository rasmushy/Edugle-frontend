type IUser = {
  avatar?: string;
  username: string;
  description?: string;
};

type IMessage = {
  id: string;
  sender: string;
  content: string;
  date: Date;
};

export type { IUser, IMessage };
