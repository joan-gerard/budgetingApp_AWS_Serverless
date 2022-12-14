import { AWS } from '@serverless/typescript';

// const corsSettings = {
//   headers: [
//     // Specify allowed headers
//     'Content-Type',
//     'X-Amz-Date',
//     'Authorization',
//     'X-Api-Key',
//     'X-Amz-Security-Token',
//     'X-Amz-User-Agent',
//   ],
//   allowCredentials: false,
// };

interface Authorizer {
  name: string;
  type: string;
  arn: {
    'Fn::GetAtt': string[];
  };
}
const authorizer: Authorizer = {
  name: 'authorizer',
  type: 'COGNITO_USER_POOLS',
  arn: { 'Fn::GetAtt': ['CognitoUserPool', 'Arn'] },
};

const functions: AWS['functions'] = {
  websocketConnect: {
    handler: 'src/functions/websocketConnect/index.handler',
    events: [
      {
        websocket: {
          route: '$connect',
        },
      },
    ],
  },
  websocketDisconnect: {
    handler: 'src/functions/websocketDisconnect/index.handler',
    events: [
      {
        websocket: {
          route: '$disconnect',
        },
      },
    ],
  },
  websocketCreateMonth: {
    handler: 'src/functions/websocketCreateMonth/index.handler',
    events: [
      {
        websocket: {
          route: 'createMonth',
        },
      },
    ],
  },
  websocketListMyMonths: {
    handler: 'src/functions/websocketListMyMonths/index.handler',
    events: [
      {
        websocket: {
          route: 'listMyMonths',
        },
      },
    ],
  },
  websocketTransaction: {
    handler: 'src/functions/websocketTransaction/index.handler',
    events: [
      {
        websocket: {
          route: 'transaction',
        },
      },
    ],
  },
  getTransactions2: {
    handler: 'src/functions/getTransactions2/index.handler',
    events: [
      {
        http: {
          method: 'get',
          path: 'month/{budgetMonth}',
          authorizer,
          cors: true,
        },
      },
    ],
  },
};

export default functions;
