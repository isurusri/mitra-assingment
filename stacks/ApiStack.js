import * as sst from "@serverless-stack/resources";

export default class ApiStack extends sst.Stack {
    // Public reference to the API
    api;

    constructor(scope, id, props) {
        super(scope, id, props);

        const { table } = props;

        // Create the API
        this.api = new sst.Api(this, "Api", {
            defaultAuthorizationType: "AWS_IAM",
            defaultFunctionProps: {
                environment: {
                    TABLE_NAME: table.tableName,
                },
            },
            routes: {
                "POST   /news": "src/createNews.main",
                "GET /news/{id}": "src/getNews.main",
                "GET /news": "src/listNews.main",
                "PUT    /news/{id}": "src/editNews.main",
                "DELETE    /news/{id}": "src/deleteNews.main"
            },
        });

        // Allow the API to access the table
        this.api.attachPermissions([table]);

        // Show the API endpoint in the output
        this.addOutputs({
            ApiEndpoint: this.api.url,
        });
    }
}