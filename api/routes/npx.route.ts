import express from "express";
import expressAsyncHandler from "express-async-handler";
import { github } from "../config/github";
import env from "../config/env";

const npx = express.Router();
const username = env.GITHUB_USERNAME;

npx.get(
  "/me",
  expressAsyncHandler(async (_, res): Promise<any> => {
    try {
      const profile = await github.get("/users/" + username).then((res) => {
        return {
          name: res.data.name,
          username: res.data.login,
          bio: res.data.bio,
          url: res.data.html_url,
          location: res.data.location,
          repos: res.data.public_repos,
        };
      });

      const { data: commits } = await github.get(
        "/search/commits?q=author:" + username
      );

      const { data: repos } = await github.get(
        "/users/" + username + "/repos",
        {
          params: {
            sort: "updated",
            per_page: 10,
            type: "owner",
          },
        }
      );

      const recentRepos = repos
        .filter((repo: any) => !repo.fork && !repo.private)
        .map((repo: any) => ({
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
        }));

      const data = {
        profile,
        commits: commits.total_count,
        recentRepos,
      };

      return res.send({
        success: true,
        message: "Karthikeya's github",
        data,
      });
    } catch (error) {
      console.error("Error:", error);
      return res.send({
        success: false,
        message: "Failed to fetch live data",
      });
    }
  })
);

export { npx };
