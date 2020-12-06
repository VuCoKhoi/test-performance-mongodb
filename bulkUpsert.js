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

function updateMany(allItemsArray, Model) {
  return Promise.all(
    allItemsArray.map((item) =>
      Model.findOneAndUpdate(item.query, item.document)
    )
  );
}

exports.updateMany = updateMany;
exports.bulkUpsert = bulkUpsert;
