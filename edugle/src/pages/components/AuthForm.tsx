import React, { FormEvent, useState } from "react";

export default function AuthForm({ title, apiEndpoint, toggle }: any) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit the data. Please try again.");
      }

      toggle;
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[400px] w-[325px] flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <button
        className="absolute right-2 top-2 text-2xl"
        onClick={toggle}
        aria-label="Close"
      >
        &times;
      </button>
      <div className="flex flex-col bg-white/10 items-center justify-center">
        <h1 className="mb-4 text-2xl font-semibold">{title}</h1>
        <form
          onSubmit={handleSubmit}
          className="mb-4 rounded bg-white/15 px-8 pb-8 pt-6"
        >
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-white-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full rounded border border-gray-500 px-3 py-2 text-white-700 focus:border-blue-500 focus:outline-none focus:ring"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-white-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full rounded border border-gray-500 px-3 py-2 text-white-700 focus:border-blue-500 focus:outline-none focus:ring"
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
        <div className="mb-2 h-5">
          {error && (
            <div className="mb-2 block text-sm font-bold text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
