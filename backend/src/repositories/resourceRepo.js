import { db } from '../data/connection';

export const resourceRepo = {

  async getResources(kingdomId) {
    const sqlGetResources = 'SELECT type, amount, generation, UNIX_TIMESTAMP(updatedAt) as updatedAt FROM resources WHERE kingdom_id = ?;';
    try {
      return await db.query(sqlGetResources, kingdomId);
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },

  async insertResource(kingdomId, type, amount) {
    const sqlInsertResource = 'INSERT INTO resources(kingdom_id, type, amount) VALUES(?,?,?);';
    try {
      return await db.query(sqlInsertResource, [kingdomId, type, amount]);
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },

  async updateResources(kingdomId) {
    const sql = `UPDATE resources 
                    SET amount = CASE 
                    WHEN amount + (FLOOR(((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(updatedAt)) / 60 )) * generation ) < 0 THEN 0 
                    ELSE amount + (FLOOR(((UNIX_TIMESTAMP(NOW()) - UNIX_TIMESTAMP(updatedAt)) / 60 )) * generation ) 
                    END
                    WHERE kingdom_id=?;`;
    try {
      return await db.query(sql, kingdomId);
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },

  async getGoldAmount(kingdomId) {
    const sqlGetGoldAmount = 'SELECT amount FROM resources WHERE type = \'gold\' AND kingdom_id = ?;';
    try {
      const getGoldAmount = await db.query(sqlGetGoldAmount, [kingdomId]);
      return getGoldAmount.results;
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },

  async handlePurchase(kingdomId, price) {
    const sql = `
      UPDATE resources
      SET amount = amount - ?
      WHERE kingdom_id = ?
      AND type = 'gold';  
    `;
    try {
      return await db.query(sql, [price, kingdomId]);
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },

  async updateResourceRate(kingdomId, resourceType, increment) {
    try {
      const sql = `
        UPDATE resources
        SET generation = generation + ?
        WHERE kingdom_id = ? 
        AND type = ?;
      `;
      return await db.query(sql, [increment, kingdomId, resourceType]);
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },
  async updateResourceAfterBattle(kingdomId, goldAmount, foodAmount) {
    const sqlQuery = 'UPDATE resources SET amount = (case when type = "gold" then amount + ? when type = "food" then amount + ? end) WHERE kingdom_id = ?';
    try {
      return await db.query(sqlQuery, [goldAmount, foodAmount, kingdomId]);
    } catch (err) {
      throw { status: 500, message: err.sqlMessage };
    }
  },
};
