import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import cors from "cors";
import { get } from "http";

const app = express();
const port = 8000;


app.use(cors({
  origin: ["http://localhost:5173", "https://api.openfort.xyz/iam/v1/oauth/third_party", "8ae1a80f72ae.ngrok-free.app"],
  credentials: true,
}));

app.all('/api/auth/{*any}', toNodeHandler(auth));


app.use(express.json());

app.get("/api/token", async (req, res) => {
  console.log(req.headers)
  try{
  const sessionToken = req.headers["cookie"]?.split('; ').find(row => row.startsWith('better-auth.session_token='))?.split('=')[1];
  if (!sessionToken) {
    return res.status(401).json({ error: "No session token provided" });
  }
    return res.json({ token: sessionToken });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
});

app.post("/api/validate", async (req, res) => {
  console.log(req.headers)
  const { payload } = req.body;
  const token = payload;
  if (!token) return res.status(401).json({ error: "No token provided" });

  console.log("Received token:", token);
  const requestBody = {
      headers: new Headers({
          cookie: `better-auth.session_token=${token}`, 
          ...Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key.toLowerCase(), value])),
        }),
    }

  console.log(requestBody);

  try {
    const session = await auth.api.getSession(requestBody);

    console.log("Session data:", session);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Invalid session" });
    }

    return res.json({
      userId: session.user.id,
      email: session.user.email,
    });
  } catch (err) {
    return res.status(500).json({ error:  err} );
  }
});


app.get("/", (_, res) => {
  res.send("Better Auth backend running via Vite + vite-node");
});

app.listen(port, () => {
  console.log(`Better Auth app listening on port ${port}`);
});

