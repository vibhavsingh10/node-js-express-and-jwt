const { request } = require("express")
const jwt = require("jsonwebtoken")
const { readFile } = require("../daos/index")

const dbFilePath = `${__dirname}../../../data/user-db.json`
console.log("vibhav")
module.exports = {
    authenticate: async (req, res, next) => {
        console.log("vibbbb")
        if (Object.keys(res.locals).length) return next();
        const adminData = await readFile(dbFilePath);
        console.log("vibh")
        console.log(adminData)

        const {
            username, password
        } = req.body;
        if (username === adminData.username && password === adminData.password) {
            console.log("aloksdd", adminData);
            const token = jwt.sign({ id: adminData.id }, req.app.get('secretKey'), { expiresIn: '1h' });
            res.json({ status: 200, data: { token } });
        }
        else {
            res.status(401).send('NO ACCESS TOKEN FOUND!!!');
            next();
        }
    }
}










 //NOTE: match if username & password are equal to the ones from user-db.json
/** if true:
 * const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
 * res.json({ status: 200, data: { token } });
 */
/**
 * else:
 * res.locals.status = 400
 * res.locals.error = "Invalid username/password !"
 * next();
 */
