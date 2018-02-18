var payloadAsJSON = function (payloadData) {
  let data;
  try {
    data = JSON.parse(payloadData);
  } catch (e) {
    throw new Error ("Received non valid JSON.");
  }
  return data;
}

module.exports = {
  payloadAsJSON: payloadAsJSON
}