const getExp = async(userID, db) => {
  const ref = db.collection("fetchObjects").doc("userXp");
  const doc = await ref.get();
  let previousUserXp = doc.data()[userID] || 0;
  ref.set(
    {
      [userID]: previousUserXp + 10,
    },
    { merge: true }
  );
}

module.exports = getExp;