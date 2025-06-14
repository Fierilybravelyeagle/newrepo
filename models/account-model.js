const database = require("../database/");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await database.query(sql, [account_firstname, account_lastname, account_email, account_password]);
  } catch (error) {
    return error.message;
  }
}

async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await database.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

module.exports = { registerAccount, checkExistingEmail };
