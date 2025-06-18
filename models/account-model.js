const database = require("../database/");

/* *****************************
 *   Register new account
 ***************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname, account_lastname, account_email, account_password, account_type
      ) VALUES ($1, $2, $3, $4, 'Client') RETURNING *`;
    return await database.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Check if email exists
 ***************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await database.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Get account by email
 ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await database.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
       FROM account WHERE account_email = $1`,
      [account_email]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error in getAccountByEmail: " + error.message);
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
};
