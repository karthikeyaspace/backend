import axios from "axios";
import env from "./env";

const github = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${env.GITHUB_API_KEY}`,
    Accept: "application/vnd.github+json",
  },
});

export { github };
