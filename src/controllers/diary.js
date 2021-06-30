const { readFile, writeFile } = require("../daos/index") //NOTE: Importing the readFile & writeFile as separate functions

const ifErrorInResSendIt = (res, next) => {
  if (Object.keys(res.locals).length) return next()
}
const dbFilePath = `${__dirname}../../../data/diary-db.json`
module.exports = {
  getAll: async (req, res, next) => {
    ifErrorInResSendIt(res, next)
    try {
      const data = await readFile(dbFilePath)
      res.send(data)
    } catch (error) {
      res.locals.error = error.message
      next()
    }
  },
  getById: async (req, res, next) => {
    ifErrorInResSendIt(res, next)
    try {
      const id = Number(req.params.id)
      const diary = await readFile(dbFilePath)
      const singleEntry = diary.find((entry) => entry.id === id)

      if (!singleEntry) {
        res.locals.status = 404
        res.locals.error = `Account with id: ${id} not found!`
        return next()
      } else {
        res.send(singleEntry)
      }
    } catch (error) {
      res.locals.error = error.message
      next()
    }
  },
  create: async (req, res, next) => {
    ifErrorInResSendIt(res, next)
    //NOTE: implement create operation same way as course day 7
    //post
    // router.post("/accounts", async (req, res) => {
    try {
      const newEntry = req.body;
      const diary = await readFile(dbFilePath); //NOTE: to read data from file at dbFilePath variable's path
      const newData = { id: id, ...newEntry };
      newEntry.id = diary.length + 1; //NOTE: calculating id based on array length

      diary.push(newEntry);
      await writeFile(dbFilePath, diary); //NOTE: to save data into the file at dbFilePath variable's path

      res.send(diary);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  updateById: async (req, res, next) => {
    ifErrorInResSendIt(res, next)
    //put
    //NOTE: implement update operation same way as course day 7

    // const id = Number(req.params.id); //NOTE: req.params contains object with all the parameters send. this id should be same name as specified in the route above
    // const newEntry = req.body;
    // const diary = await readFile(dbFilePath); //NOTE: to read data from file at dbFilePath variable's path

    // let flag = false; //NOTE: to keep check if any document with id exists
    // let resultIndex = -1; //NOTE: to keep track of index of object with satisfying condition's id so that we can only return the modified document
    // for (let index = 0; index < diary.length; index++) { //NOTE: for loop to update the document by first finding the document with same id and then modifying it by destructuring
    //   let id = newEntry[index];
    //   console.log(account, newEntry, id);
    //   if (entry.id === id) {
    //     account = {
    //       ...account,
    //       ...newEntry
    //     };
    //     resultIndex = index;
    //     flag = true;
    //     diary[index] = account;
    //     break;
    //   }
    // }

    // if (!flag) {
    //   res.status(404).send(`Account with id: ${id} not found!`);
    // } else {
    //   await writeFile(dbFilePath, diary); //NOTE: to save data into the file at dbFilePath variable's path
    //   res.send(diary[resultIndex]);
    // }
    try {
      const id = Number(req.params.id);
      const diary = await readFile(dbFilePath);
      const singleEntry = diary.find((entry) => entry.id === id);
      const incomingData = req.body;

      if (!singleEntry) {
          res.locals.status = 404;
          res.locals.error = `Account with id: ${id} not found!`;
          next();
      } else {
          const index = diary.indexOf(singleEntry);
          const updatedDiary = { ...singleEntry, ...incomingData };
          diary[index] = updatedDiary;
          await writeFile(dbFilePath, diary);
          res.send(diary[index]);
      }
  } catch (error) {
      res.locals.error = error.message;
      next();
  }

  },
  deleteById: async (req, res, next) => {
    ifErrorInResSendIt(res, next)
    //NOTE: implement delete operation same way as course day 7
    //delete

    const id = Number(req.params.id); //NOTE: req.params contains object with all the parameters send. this id should be same name as specified in the route above
    const diary = await readFile(dbFilePath); //NOTE: to read data from file at dbFilePath variable's path
    const newAccounts = diary.find((entry) => entry.id === id); //NOTE: filter based on condition to keep all the objects with id not equal to received id

    if (!newAccounts) {
      res.status(404).send(`Account with id: ${id} not found!`);
    } else {
      await writeFile(dbFilePath, newAccounts, "utf-8");
      res.send(newAccounts);
    }

  },
}
