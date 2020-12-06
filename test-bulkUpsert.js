const {
  bulkUpsert,
  updateMany,
  bulkWriteUpdate,
  bulkUpsertV2,
} = require("./bulkUpsert");
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
  const data = createData(5000);
  console.timeEnd("time-create-data");
  console.log("data length: ", data.length);

  console.log("\n\nbulkUpdate use initializeUnorderedBulkOp");

  await bulkUpsertModel.deleteMany();

  console.time("time-insert-data-1");
  await bulkUpsert(data, bulkUpsertModel);
  console.timeEnd("time-insert-data-1");

  console.time("time-update-data-1");
  await bulkUpsert(data, bulkUpsertModel);
  console.timeEnd("time-update-data-1");

  console.log("\n\nbulkUpdateV2 use initializeUnorderedBulkOp");

  await bulkUpsertModel.deleteMany();

  console.time("time-insert-data-1-v2");
  await bulkUpsertV2(data, bulkUpsertModel);
  console.timeEnd("time-insert-data-1-v2");

  console.time("time-update-data-1-v2");
  await bulkUpsertV2(data, bulkUpsertModel);
  console.timeEnd("time-update-data-1-v2");

  console.log("\n\nupdateMany use findOneAndUpdate");

  await bulkUpsertModel.deleteMany();

  console.time("time-insert-data-2");
  await updateMany(data, bulkUpsertModel);
  console.timeEnd("time-insert-data-2");

  console.time("time-update-data-2");
  await updateMany(data, bulkUpsertModel);
  console.timeEnd("time-update-data-2");

  console.log("\n\nbulkWriteUpdate");

  await bulkUpsertModel.deleteMany();

  console.time("time-insert-data-3");
  await bulkWriteUpdate(data, bulkUpsertModel);
  console.timeEnd("time-insert-data-3");

  console.time("time-update-data-3");
  await bulkWriteUpdate(data, bulkUpsertModel);
  console.timeEnd("time-update-data-3");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log("error", error);
    process.exit(0);
  });
