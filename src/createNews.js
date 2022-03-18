import * as uuid from "uuid";
import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.TABLE_NAME,
        Item: {
            email: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
            newsId: uuid.v1(),
            userName: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
            news: data.news,
            attachment: data.attachment,
            createdAt: Date.now(),
        },
    };

    await dynamoDb.put(params);

    return params.Item;
});