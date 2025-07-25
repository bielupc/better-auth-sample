import { useState } from "react";
import { authClient } from "../lib/auth-client"; 

type SignupProps = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
};


export function SignupForm({setPage}: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSignup() {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
        // callbackURL: "/",
      },
      {
        onRequest: () => console.log("Signing up..."),
        onSuccess: () => alert("Signup successful! Please verify your email."),
        onError: ctx => alert("Signup failed: " + ctx.error.message),
      }
    );
    setPage("login");
  }

  return (
    <div className="flex flex-col space-y-4 w-3/4">
      <input placeholder="Name" className="px-4 py-4 rounded-lg" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Email" className="px-4 py-4 rounded-lg" value={email} onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        className="px-4 py-4 rounded-lg"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="bg-[#FB6157] py-3 rounded-lg font-bold mt-8 hover:bg-white hover:text-[#242424]" onClick={handleSignup}>Sign Up</button>
    </div>
  );
}
