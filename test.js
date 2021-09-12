"use strict";

async function main() {
  await require("./tests/basics.js")().catch(function (err) {
    console.error("FAIL: tests/basics.js", err.message);
    process.exit(1);
  });
}

main();
