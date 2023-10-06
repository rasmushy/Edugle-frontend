/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type AdminWithTokenInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  role: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Chat = {
  __typename?: 'Chat';
  created_date: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  messages?: Maybe<Array<Maybe<Message>>>;
  users: Array<UserInfo>;
};

export type CreateChatInput = {
  created_date: Scalars['Date']['input'];
  users: Array<Scalars['ID']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  date: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  sender: User;
};

export type MessageInput = {
  content: Scalars['String']['input'];
  date: Scalars['Date']['input'];
  sender: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createChat?: Maybe<Chat>;
  createMessage?: Maybe<Message>;
  deleteChatAsAdmin?: Maybe<Chat>;
  deleteMessage?: Maybe<Message>;
  deleteMessageAsAdmin?: Maybe<Message>;
  deleteUser?: Maybe<TokenMessage>;
  deleteUserAsAdmin?: Maybe<TokenMessage>;
  loginUser?: Maybe<TokenMessage>;
  registerUser?: Maybe<TokenMessage>;
};


export type MutationCreateChatArgs = {
  chat?: InputMaybe<CreateChatInput>;
  user?: InputMaybe<UserWithTokenInput>;
};


export type MutationCreateMessageArgs = {
  message: MessageInput;
  user: UserWithTokenInput;
};


export type MutationDeleteChatAsAdminArgs = {
  admin?: InputMaybe<AdminWithTokenInput>;
  id: Scalars['ID']['input'];
};


export type MutationDeleteMessageArgs = {
  id: Scalars['ID']['input'];
  user?: InputMaybe<UserWithTokenInput>;
};


export type MutationDeleteMessageAsAdminArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteUserAsAdminArgs = {
  deleteUserID: Scalars['ID']['input'];
  user?: InputMaybe<DeleteUserAsAdminInput>;
};


export type MutationLoginUserArgs = {
  credentials: LoginInput;
};


export type MutationRegisterUserArgs = {
  user: RegisterInput;
};

export type Query = {
  __typename?: 'Query';
  chatByUser?: Maybe<Chat>;
  chats?: Maybe<Array<Maybe<Chat>>>;
  getUserById?: Maybe<User>;
  messageById?: Maybe<Message>;
  messages?: Maybe<Array<Maybe<Message>>>;
  messagesBySender?: Maybe<Array<Maybe<Message>>>;
  users?: Maybe<Array<Maybe<User>>>;
  validateToken?: Maybe<TokenMessage>;
};


export type QueryChatByUserArgs = {
  user_id: Scalars['ID']['input'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMessageByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMessagesBySenderArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUsersArgs = {
  token: Scalars['String']['input'];
};

export type RegisterInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  chatCreated?: Maybe<Chat>;
  userSub?: Maybe<User>;
};

export type TokenMessage = {
  __typename?: 'TokenMessage';
  message: Scalars['String']['output'];
  token?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastLogin?: Maybe<Scalars['Date']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  avatar?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastLogin?: Maybe<Scalars['Date']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type UserWithTokenInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
  token: Scalars['String']['input'];
};

export type DeleteUserAsAdminInput = {
  id: Scalars['ID']['input'];
  token: Scalars['String']['input'];
};
