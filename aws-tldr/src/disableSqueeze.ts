const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
export async function disableSqueeze(event){

  const functionName = 'aws-squeezy-dev-squeeze';

  let message;
  try {
    await lambda.putFunctionConcurrency({
      FunctionName: functionName,
      ReservedConcurrentExecutions: 0
    }).promise();

    message = `Successfully disabled Lambda function: ${functionName}`;
  } catch (error) {
    message = `Error disabling Lambda function: ${error}`;
  }

  console.log(message);

  return {
      statusCode: 300,
      body: JSON.stringify(
          { message },
          null,
          2
      ),
  };
}
