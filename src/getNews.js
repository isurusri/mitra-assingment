import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            email: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
            newsId: event.pathParameters.id,
        },
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("News not found!");
    }

    return result.Item;
});