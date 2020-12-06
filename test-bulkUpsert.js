const { bulkUpsert, updateMany } = require("./bulkUpsert");
const bulkUpsertModel = require("./models/bulkUpsert");
const connectMongo = require("./core/connectMongo");

function createData(maxNumber = 1000000) {
  return Array(maxNumber)
    .fill(1)
    .map((_, index) => ({
      query: { number: index },
      document: {
        number: index,
      },
    }));
}

async function main() {
  await connectMongo();

  console.time("time-create-data");
  const data = createData(10000);
  console.timeEnd("time-create-data");

  console.log("\n\nbulkUpdate");

  await bulkUpsertModel.deleteMany();

  console.time("time-insert-data-1");
  await bulkUpsert(data, bulkUpsertModel);
  console.timeEnd("time-insert-data-1");

  console.time("time-update-data-1");
  await bulkUpsert(data, bulkUpsertModel);
  console.timeEnd("time-update-data-1");

  console.log("\n\nupdateMany");

  await bulkUpsertModel.deleteMany();

  console.time("time-insert-data-2");
  await updateMany(data, bulkUpsertModel);
  console.timeEnd("time-insert-data-2");

  console.time("time-update-data-2");
  await updateMany(data, bulkUpsertModel);
  console.timeEnd("time-update-data-2");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log("error", error);
    process.exit(0);
  });
