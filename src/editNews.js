import handler from "./util/handler";
import dynamoDb from "./util/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.TABLE_NAME,
        Key: {
            email: event.requestContext.authorizer.iam.cognitoIdentity.identityId,
            newsId: event.pathParameters.id,
        },

        UpdateExpression: "SET news = :news, attachment = :attachment",
        ExpressionAttributeValues: {
            ":attachment": data.attachment || null,
            ":news": data.news || null,
        },

        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return { status: true };
});