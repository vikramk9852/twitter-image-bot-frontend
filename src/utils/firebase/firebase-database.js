
class FirebaseDB {

  constructor(database) {
    FirebaseDB.database = database;
  }

  // *** Databse API ***
  write(path, data) {
    let ref = FirebaseDB.database.ref(path);
    return ref.set(data);
  }

  getData(dataPath, orderBy, startAfter, limit) {
    let query = FirebaseDB.database.collection(dataPath);
    if (orderBy) {
      query = query.orderBy(orderBy.field, orderBy.order);
    }

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    if (limit) {
      query = query.limit(limit);
    }

    return query.get();
  }
}

export default FirebaseDB;