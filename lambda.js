exports.handler = (event, context, callback) => {
  console.log('event: ' + JSON.stringify(event));
  callback(null, event);
};