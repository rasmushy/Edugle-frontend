import React, { FormEvent, useState } from "react";

export default function AuthForm({
  title,
  onFormSubmit,
  toggle,
  error,
  successMessage,
}: {
  title: string;
  onFormSubmit: (e: FormEvent<HTMLFormElement>) => void;
  toggle: () => void;
  error: any;
  successMessage: string;
  email: string;
  password: string;
  username: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <div className="flex h-[400px] w-[325px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <button
        className="color-white absolute right-2 top-2 text-2xl"
        onClick={toggle}
        aria-label="Close"
      >
        &times;
      </button>
      <div className="flex flex-col items-center justify-center bg-white/10">
        <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
        <form
          onSubmit={onFormSubmit}
          className="bg-white/15 mb-4 rounded px-8 pb-8 pt-6"
        >
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-white">
              Username
            </label>
            <input
              className="w-full rounded border border-gray-500 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring"
              type="username"
              name="username"
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-white">
              Email
            </label>
            <input
              className="w-full rounded border border-gray-500 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring"
              type="email"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-white">
              Password
            </label>
            <input
              className="w-full rounded border border-gray-500 px-3 py-2 text-black focus:border-blue-500 focus:outline-none focus:ring"
              type="password"
              name="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : title}
            </button>
          </div>
        </form>
        <div className="mb-2 h-5">
          {error ? (
            <div className="mb-2 block text-sm font-bold text-red-700">
              {error.message}
            </div>
          ) : null}

          {successMessage ? (
            <div className="text-green mb-2 block text-sm font-bold">
              {successMessage}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
