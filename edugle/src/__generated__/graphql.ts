/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
};

export type AdminWithTokenInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  role: Scalars["String"]["input"];
  token: Scalars["String"]["input"];
};

export type AuthUser = {
  __typename?: "AuthUser";
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  role: Scalars["String"]["output"];
  token: Scalars["String"]["output"];
  username: Scalars["String"]["output"];
};

export type Chat = {
  __typename?: "Chat";
  created_date: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  messages?: Maybe<Array<Maybe<Message>>>;
  users: Array<UserInfo>;
};

export type ChatOrQueueResponse = PairedChatResponse | QueuePositionResponse;

export type CreateChatInput = {
  users: Array<Scalars["ID"]["input"]>;
};

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Message = {
  __typename?: "Message";
  content: Scalars["String"]["output"];
  date: Scalars["Date"]["output"];
  id: Scalars["ID"]["output"];
  sender: User;
};

export type MessageInput = {
  content: Scalars["String"]["input"];
  senderToken: Scalars["String"]["input"];
};

export type ModifyUserWithTokenAndRoleInput = {
  id: Scalars["ID"]["input"];
  role: Scalars["String"]["input"];
};

export type Mutation = {
  __typename?: "Mutation";
  addLike?: Maybe<Scalars["Int"]["output"]>;
  createChat?: Maybe<Chat>;
  createMessage?: Maybe<Message>;
  deleteChatAsAdmin?: Maybe<Chat>;
  deleteMessage?: Maybe<Message>;
  deleteMessageAsAdmin?: Maybe<Message>;
  deleteUser?: Maybe<TokenMessage>;
  deleteUserAsAdmin?: Maybe<TokenMessage>;
  dequeueUser?: Maybe<QueuePositionResponse>;
  initiateChat?: Maybe<ChatOrQueueResponse>;
  joinChat?: Maybe<Chat>;
  leaveChat?: Maybe<Chat>;
  loginUser?: Maybe<TokenMessage>;
  modifyUser?: Maybe<TokenMessage>;
  modifyUserAsAdmin?: Maybe<TokenMessage>;
  registerUser?: Maybe<TokenMessage>;
  removeLike?: Maybe<Scalars["Int"]["output"]>;
  updateUserStatus?: Maybe<Scalars["Boolean"]["output"]>;
};

export type MutationAddLikeArgs = {
  token?: InputMaybe<Scalars["String"]["input"]>;
  username: Scalars["String"]["input"];
};

export type MutationCreateChatArgs = {
  chat?: InputMaybe<CreateChatInput>;
};

export type MutationCreateMessageArgs = {
  chat: Scalars["ID"]["input"];
  message: MessageInput;
};

export type MutationDeleteChatAsAdminArgs = {
  admin?: InputMaybe<AdminWithTokenInput>;
  id: Scalars["ID"]["input"];
};

export type MutationDeleteMessageArgs = {
  id: Scalars["ID"]["input"];
  userToken: Scalars["String"]["input"];
};

export type MutationDeleteMessageAsAdminArgs = {
  id: Scalars["ID"]["input"];
  userToken: Scalars["String"]["input"];
};

export type MutationDeleteUserArgs = {
  token?: InputMaybe<Scalars["String"]["input"]>;
};

export type MutationDeleteUserAsAdminArgs = {
  deleteUserID: Scalars["ID"]["input"];
  user?: InputMaybe<DeleteUserAsAdminInput>;
};

export type MutationDequeueUserArgs = {
  token: Scalars["String"]["input"];
};

export type MutationInitiateChatArgs = {
  token: Scalars["String"]["input"];
};

export type MutationJoinChatArgs = {
  chatId: Scalars["ID"]["input"];
  token: Scalars["String"]["input"];
};

export type MutationLeaveChatArgs = {
  chatId: Scalars["ID"]["input"];
  token: Scalars["String"]["input"];
};

export type MutationLoginUserArgs = {
  credentials: LoginInput;
};

export type MutationModifyUserArgs = {
  modifyUser?: InputMaybe<ModifyUserInput>;
};

export type MutationModifyUserAsAdminArgs = {
  modifyUser?: InputMaybe<ModifyUserWithTokenAndRoleInput>;
  user?: InputMaybe<ModifyUserAsAdminInput>;
};

export type MutationRegisterUserArgs = {
  user: RegisterInput;
};

export type MutationRemoveLikeArgs = {
  token?: InputMaybe<Scalars["String"]["input"]>;
  username: Scalars["String"]["input"];
};

export type MutationUpdateUserStatusArgs = {
  status?: InputMaybe<Scalars["String"]["input"]>;
  token?: InputMaybe<Scalars["String"]["input"]>;
};

export type PairedChatResponse = {
  __typename?: "PairedChatResponse";
  chatId: Scalars["ID"]["output"];
  status: Scalars["String"]["output"];
};

export type Query = {
  __typename?: "Query";
  chatById?: Maybe<Chat>;
  chatByUser?: Maybe<Chat>;
  chats?: Maybe<Array<Maybe<Chat>>>;
  checkAdmin: AuthUser;
  checkToken: AuthUser;
  getUserById?: Maybe<User>;
  getUserByToken?: Maybe<User>;
  messageById?: Maybe<Message>;
  messages?: Maybe<Array<Maybe<Message>>>;
  messagesBySenderId?: Maybe<Array<Maybe<Message>>>;
  messagesBySenderToken?: Maybe<Array<Maybe<Message>>>;
  queue?: Maybe<Array<Maybe<QueueEntry>>>;
  queuePosition: QueuePositionResponse;
  users?: Maybe<Array<Maybe<User>>>;
  validateToken?: Maybe<TokenMessage>;
};

export type QueryChatByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryChatByUserArgs = {
  token: Scalars["String"]["input"];
};

export type QueryCheckAdminArgs = {
  token: Scalars["String"]["input"];
};

export type QueryCheckTokenArgs = {
  token: Scalars["String"]["input"];
};

export type QueryGetUserByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGetUserByTokenArgs = {
  token: Scalars["String"]["input"];
};

export type QueryMessageByIdArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryMessagesBySenderIdArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryMessagesBySenderTokenArgs = {
  token: Scalars["String"]["input"];
};

export type QueryQueuePositionArgs = {
  token: Scalars["String"]["input"];
};

export type QueryUsersArgs = {
  token: Scalars["String"]["input"];
};

export type QueueEntry = {
  __typename?: "QueueEntry";
  id: Scalars["ID"]["output"];
  joinedAt: Scalars["Date"]["output"];
  position: Scalars["Int"]["output"];
  userId: User;
};

export type QueuePositionResponse = {
  __typename?: "QueuePositionResponse";
  position: Scalars["Int"]["output"];
  status: Scalars["String"]["output"];
};

export type RegisterInput = {
  avatar?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  role?: InputMaybe<Scalars["String"]["input"]>;
  username: Scalars["String"]["input"];
};

export type Subscription = {
  __typename?: "Subscription";
  chatEnded?: Maybe<Chat>;
  chatStarted?: Maybe<Chat>;
  messageCreated?: Maybe<Chat>;
  queuePositionUpdated?: Maybe<Scalars["Int"]["output"]>;
  userJoinedQueue?: Maybe<QueueEntry>;
  userLeftQueue?: Maybe<QueueEntry>;
  userOnlineStatus: UserStatus;
};

export type SubscriptionMessageCreatedArgs = {
  chatId: Scalars["ID"]["input"];
};

export type SubscriptionQueuePositionUpdatedArgs = {
  userId: Scalars["ID"]["input"];
};

export type SubscriptionUserJoinedQueueArgs = {
  token: Scalars["String"]["input"];
};

export type SubscriptionUserLeftQueueArgs = {
  token: Scalars["String"]["input"];
};

export type SubscriptionUserOnlineStatusArgs = {
  userId: Scalars["ID"]["input"];
};

export type TokenMessage = {
  __typename?: "TokenMessage";
  message: Scalars["String"]["output"];
  token?: Maybe<Scalars["String"]["output"]>;
  user: User;
};

export type User = {
  __typename?: "User";
  avatar?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  lastLogin?: Maybe<Scalars["Date"]["output"]>;
  likes?: Maybe<Scalars["Int"]["output"]>;
  password?: Maybe<Scalars["String"]["output"]>;
  role?: Maybe<Scalars["String"]["output"]>;
  username: Scalars["String"]["output"];
};

export type UserInfo = {
  __typename?: "UserInfo";
  avatar?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  email?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  lastLogin?: Maybe<Scalars["Date"]["output"]>;
  username?: Maybe<Scalars["String"]["output"]>;
};

export type UserStatus = {
  __typename?: "UserStatus";
  isOnline: Scalars["Boolean"]["output"];
  userId: Scalars["ID"]["output"];
};

export type UserWithTokenInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  token: Scalars["String"]["input"];
};

export type DeleteUserAsAdminInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  token: Scalars["String"]["input"];
};

export type ModifyUserAsAdminInput = {
  id?: InputMaybe<Scalars["ID"]["input"]>;
  token: Scalars["String"]["input"];
};

export type ModifyUserInput = {
  avatar?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  token: Scalars["String"]["input"];
  username?: InputMaybe<Scalars["String"]["input"]>;
};
