function transformChunkIntoLines(chunk) {
  let ret = { fieldsArray: [], leftOvers: "" };
  // Split up the chunk into lines
  let lines = chunk.split(/\r?\n/);
  // Process all lines
  for (let aa = 0; aa < lines.length - 1; aa++) {
    // Split up the line based on delimiter (| symbol, which NEVER occurs in the input data, by design)
    let fields = lines[aa].split("|");
    ret.fieldsArray.push(fields);
  }
  ret.leftOvers = lines[lines.length - 1];
  // Return the array of field arrays
  return ret;
}

module.exports.transformChunkIntoLines = transformChunkIntoLines;
