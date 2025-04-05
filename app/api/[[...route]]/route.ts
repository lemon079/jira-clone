import { Hono } from "hono";
import authRoute from "./routes/auth.route";
import { handle } from "hono/vercel";
import workspacesRoute from "./routes/workspaces.route";
import membersRoute from "../[[...route]]/routes/members.route";
import projectsRoute from "./routes/projects.route";
import tasksRoute from "../[[...route]]/routes/tasks.route";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const routes = app
  .route("/auth", authRoute)
  .route("/workspaces", workspacesRoute)
  .route("/members", membersRoute)
  .route("/projects", projectsRoute)
  .route("/tasks", tasksRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
