const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getDetails() {
  return await pool.query(
    "SELECT * FROM public.inventory"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getDetailByInvId(inv_id) {
  try {
    const data = await pool.query(
      `
      SELECT *
      FROM public.inventory AS i
      WHERE i.inv_id = $1
      `,
      [inv_id]
    );

    // If you only need the single row, you can return data.rows[0]
    return data.rows; 
  } catch (error) {
    console.error("Error in getDetailByInvId:", error);
    throw error;
  }
}
/* ***************************
 *  Get inventory item by inv_id
 * ************************** */
async function getDataByInvId(inv_id) {
  try {
    const data = await pool.query(
      `
      SELECT *
      FROM public.inventory AS i
      WHERE i.inv_id = $1
      `,
      [inv_id]
    );

    // ✅ Return only one row (the object)
    return data.rows[0];
  } catch (error) {
    console.error("Error in getDetailByInvId:", error);
    throw error;
  }
}

module.exports = { getDetails, getDetailByInvId, getDataByInvId };
