const AWS = require('aws-sdk');

//SQS input follows format {"user_id":"user_2","device":"brick","location":"antarctica"}

//initialise dynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region:'us-east-1',
    apiVersion:'2012-08-10'
});

exports.handler = async (event) => {
  try{
      //messages coming in from SQS are available on the 'Records' array property of the event object:
      const {Records} = event;
      
      //parse and extract the content of the message:
      const body = JSON.parse(Records[0].body); // in this case, only one item is present in the Records array
      //puller, think about different batch sizes and processing differently
      //something mehul sent in chat event.Records.map((record) => JSON.parse(record.body).detail).forEach(detail => {})
      
      
      //logging the incoming message body (view in cloudwatch):
      console.log("Incoming message body from SQS :", body); 
      
      //configure params for writing data to dynamo DB:
      const params = {
          TableName:'MyDynamoDBTableJS',
          Item:{
              userId : body.user_id,
              userDevice : body.device,
              userLocation : body.location,
              name : body.name,
              transaction : body.transaction
          } 
      };
      
      //write data to dynamo DB:
      await dynamoDB.put(params).promise();
      
      //success logging to cloudwatch:
      console.log('Successfully written to DynamoDB');
  }catch(error){
      //error handling
      console.error('Error in executing lambda handler for SQS',error);
      return;
  }
};