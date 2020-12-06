function bulkUpsert(allItemsArray, Model) {
  let bulk = Model.collection.initializeUnorderedBulkOp();
  return new Promise((resolve, reject) => {
    allItemsArray.forEach((item) => {
      bulk.find(item.query).upsert().updateOne({ $set: item.document });
    });
    bulk.execute((err, bulkers) => {
      if (err) {
        return reject(err);
      }
      return resolve(bulkers);
    });
  });
}

function bulkUpsertV2(allItemsArray, Model) {
  let bulk = Model.collection.initializeOrderedBulkOp();

  return new Promise((resolve, reject) => {
    allItemsArray.forEach((item, index) => {
      bulk.find(item.query).upsert().updateOne({ $set: item.document });
      if (index % 1000 == 0)
        bulk.execute(function (err, bulkers) {
          bulk = Model.collection.initializeOrderedBulkOp();
          if (err) {
            return reject(err);
          }
        });
    });
    bulk.execute((err, bulkers) => {
      if (err) {
        return reject(err);
      }
      return resolve(bulkers);
    });
  });
}

function updateMany(allItemsArray, Model) {
  return Promise.all(
    allItemsArray.map((item) =>
      Model.findOneAndUpdate(item.query, item.document, { upsert: true })
    )
  );
}

function bulkWriteUpdate(allItemsArray, Model) {
  return Model.bulkWrite(
    allItemsArray.map((item) => ({
      updateOne: {
        filter: item.query,
        update: item.document,
        upsert: true,
      },
    }))
  );
}

exports.updateMany = updateMany;
exports.bulkUpsert = bulkUpsert;
exports.bulkUpsertV2 = bulkUpsertV2;
exports.bulkWriteUpdate = bulkWriteUpdate;
