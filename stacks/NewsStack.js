import * as sst from "@serverless-stack/resources";

export default class Register extends sst.Stack {
    // Public reference to the table
    table;
    // Public reference to the bucket
    bucket;

    constructor(scope, id) {
        super(scope, id);

        // Create the table
        this.table = new sst.Table(this, "News", {
            fields: {
                email: sst.TableFieldType.STRING,
                newsId: sst.TableFieldType.STRING,
            },
            primaryIndex: { partitionKey: "email", sortKey: "newsId" },
        });

        // Create an S3 bucket
        this.bucket = new sst.Bucket(this, "Uploads", {
            s3Bucket: {
                // Allow client side access to the bucket from a different domain
                cors: [
                    {
                        maxAge: 3000,
                        allowedOrigins: ["*"],
                        allowedHeaders: ["*"],
                        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                    },
                ],
            },
        });

    }
}
