module.exports = async function (context, data) {
  context.bindings.actions = {
    actionName: 'sendToAll',
    data: `[${context.bindingData.request.connectionContext.userId}] ${data}`,
    dataType: context.bindingData.dataType,
  };
  // UserEventResponse directly return to caller
  var response = {
    data: '[SYSTEM] ack.',
    dataType: 'text',
  };
  return response;
};
