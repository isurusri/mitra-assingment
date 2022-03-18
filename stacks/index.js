import News from "./NewsStack";
import ApiStack from "./ApiStack";
import AuthStack from "./AuthStack";
import FrontendStack from "./FrontendStack";

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x"
  });

  const news = new News(app, "news")

  const apiStack = new ApiStack(app, "api", {
    table: news.table,
  });

  const authStack = new AuthStack(app, "auth", {
    api: apiStack.api,
    bucket: news.bucket,
  });

  new FrontendStack(app, "frontend", {
    api: apiStack.api,
    auth: authStack.auth,
    bucket: news.bucket,
  });
}
