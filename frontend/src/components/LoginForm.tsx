import { useState } from "react";
import { authClient } from "../lib/auth-client";
import openfort from "../lib/openfortConfig";
import { ThirdPartyOAuthProvider, TokenType } from '@openfort/openfort-js';

type LoginProps = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
};


export function LoginForm({ setPage }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: false,
      // callbackURL: "/",
    });

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/token", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch token from backend");
      }
      const { token: cookieToken } = await response.json();
      await openfort.authenticateWithThirdPartyProvider({
        provider: ThirdPartyOAuthProvider.CUSTOM,
        token: cookieToken,
        tokenType: TokenType.CUSTOM_TOKEN,
      });
      alert("Login successful!");
    } catch (err) {
      alert("Openfort authentication failed: " + err);
    } finally {
      setPage("wallet");
    }
  }

  return (
    <div className="flex flex-col space-y-4 w-3/4">
      <input
        type="email"
        className="px-4 py-4 rounded-lg"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="px-4 py-4 rounded-lg"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="bg-[#FB6157] py-3 rounded-lg font-bold mt-8 hover:bg-white hover:text-[#242424]" onClick={handleLogin}>Login</button>
    </div>
  );
}
