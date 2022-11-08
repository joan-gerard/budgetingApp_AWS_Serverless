import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { websocket } from '@libs/Websocket';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { v4 as uuid } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;

    const { connectionId, domainName, stage } = event.requestContext;

    // get the chosen month
    const { budgetMonth } = JSON.parse(event.body);
    if (!budgetMonth) {
      await websocket.send({
        connectionId,
        domainName,
        stage,
        message: JSON.stringify({
          message: 'you need to choose a month with request',
          type: 'err',
        }),
      });
      return formatJSONResponse({
        body: {},
      });
    }

    // get user who makes the request
    // removed userName
    const { userId, userName } = await Dynamo.get<UserConnectionRecord>({
      pkValue: connectionId,
      tableName,
    });

    // create group record
    const monthData: MonthRecord = {
      id: budgetMonth,
      ownerId: userId,
      budgetMonth,
    };

    await Dynamo.write({ data: monthData, tableName });

    // create group user connection record
    createUserGroupConnection: {
      const data: UserMonthRecord = {
        id: uuid(),
        pk: budgetMonth,
        sk: `user#${userId}`,
        pk2: userId,
        sk2: `month#${budgetMonth}`,

        userId,
        budgetMonth,
        userName,
      };
      await Dynamo.write({ data, tableName });
    }

    // send message that group was created

    await websocket.send({
      connectionId,
      domainName,
      stage,
      message: JSON.stringify({
        message: `Month created. You can now add income and expenses for ${budgetMonth}`,
        type: 'info',
      }),
    });

    return formatJSONResponse({
      body: {},
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
