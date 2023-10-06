type User = {
  avatar?: string;
  username: string;
  description?: string;
};

type Message = {
  sender: string;
  content: string;
};

export type { User, Message };
