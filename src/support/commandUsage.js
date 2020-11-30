const commandUsage = async (name, db) => {
  const ref = db.collection("fetchObjects").doc("commandUsage");
  const doc = await ref.get();
  let previousUsage = doc.data()[name] || 0;
  ref.set(
    {
      [name]: previousUsage + 1,
    },
    { merge: true }
  );
};

module.exports = commandUsage;
