import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;
    console.log({ tableName, event: event.pathParameters });
    const { budgetMonth } = event.pathParameters;
    // const { beforedate, startid } = event.queryStringParameters || {};
    // const userId = event.requestContext.authorizer?.claims?.sub;

    console.log({ budgetMonth });

    // querying for all transactions
    const transactions = await Dynamo.query<TransactionRecord>({
      tableName,
      pkValue: budgetMonth,
      skKey: 'sk',
      skBeginsWith: 'transaction#',
      index: 'index1',
      // scanForwards: false,
      // startFromRecord:
      //   beforedate && startid
      //     ? {
      //         pk: groupId,
      //         sk: `message#${beforedate}`,
      //         id: startid,
      //       }
      //     : undefined,
    });

    console.log({ transactions });

    // reformat messages
    // const formattedMessages = messages.map(({ pk, sk, ...rest }) => {
    //   return {
    //     ...rest,
    //     mine: rest.fromId === userId,
    //     type: 'message',
    //   };
    // });

    return formatJSONResponse({
      body: { messages: transactions },
    });
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      body: {
        message: error.message,
      },
      statusCode: 500,
    });
  }
};
