import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { websocket } from '@libs/Websocket';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;
    const { connectionId, domainName, stage } = event.requestContext;

    //  get requesting user
    // const { userId } = await Cognito.verifyToken({ token });
    const { userId } = await Dynamo.get<UserConnectionRecord>({
      tableName,
      pkValue: connectionId,
    });

    // query months using 
    const userMonths = await Dynamo.query<UserMonthRecord>({
      tableName,
      index: 'index2',
      pkKey: 'pk2',
      pkValue: userId,
      skKey: 'sk2',
      skBeginsWith: 'month#',
    });

    console.log({userMonths})

    // return certain data from the months
    const responseData = userMonths.map(({ budgetMonth }) => ({
      budgetMonth,
    }));

    console.log({responseData})


    await websocket.send({
      connectionId,
      domainName,
      stage,
      message: JSON.stringify({
        data: responseData,
        type: 'groupData'
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
