import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

export const getDB = async () => {
  if (Platform.OS === 'web') return null; // SQLite unsupported on web natively without polyfill
  return await SQLite.openDatabaseAsync('kinmind.db');
};

export const setupDatabase = async () => {
  if (Platform.OS === 'web') return; 
  
  try {
    const db = await getDB();
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS UserStats (
        id INTEGER PRIMARY KEY DEFAULT 1,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        quests_completed INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS SavedQuests (
        id TEXT PRIMARY KEY,
        topic TEXT,
        river_name TEXT,
        date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
        quest_json TEXT,
        is_completed BOOLEAN DEFAULT 0
      );

      INSERT OR IGNORE INTO UserStats (id, xp, level, quests_completed) VALUES (1, 0, 1, 0);
    `);
  } catch (e) {
    console.warn("DB Setup skipped", e);
  }
};

export const saveQuestLocally = async (questData) => {
  if (Platform.OS === 'web') return "web_mock_id";
  
  try {
    const db = await getDB();
    const questId = `q_${Date.now()}`; 
    const questJsonString = JSON.stringify(questData);

    await db.runAsync(
      `INSERT INTO SavedQuests (id, topic, river_name, quest_json) VALUES (?, ?, ?, ?)`,
      [questId, questData.topic, questData.river_name || 'Unknown River', questJsonString]
    );
    return questId;
  } catch (e) {
    console.warn("Could not save quest locally", e);
    return null;
  }
};

export const getSavedQuests = async () => {
  if (Platform.OS === 'web') return [];
  
  try {
    const db = await getDB();
    return await db.getAllAsync('SELECT * FROM SavedQuests ORDER BY date_created DESC');
  } catch(e) {
    return [];
  }
};

export const addXP = async (amount) => {
  if (Platform.OS === 'web') return;
  try {
    const db = await getDB();
    await db.runAsync(
      `UPDATE UserStats SET xp = xp + ? WHERE id = 1`,
      [amount]
    );
  } catch(e){}
};
