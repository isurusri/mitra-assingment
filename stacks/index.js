import News from "./NewsStack";
import ApiStack from "./ApiStack";
import AuthStack from "./AuthStack";

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x"
  });

  const news = new News(app, "news")

  const apiStack = new ApiStack(app, "api", {
    table: news.table,
  });

  new AuthStack(app, "auth", {
    api: apiStack.api,
    bucket: news.bucket,
  });
}
