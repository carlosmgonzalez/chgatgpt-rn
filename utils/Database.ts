import { SQLiteDatabase } from "expo-sqlite";
import { Chat, Message, Role } from "./Interfaces";

export const migrateDbIfNeeded = async (db: SQLiteDatabase) => {
  const DATABASE_VERSION = 1;

  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) return;

  if (currentDbVersion === 0) {
    const result = await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE chats (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL
      );

      CREATE TABLE messages (
        id INTEGER PRIMARY KEY NOT NULL,
        chat_id INTERGER NOT NULL,
        content TEXT NOT NULL,
        imageUrl TEXT,
        role TEXT,
        prompt TEXT,
        FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
      );
    `);

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGME user_version = ${DATABASE_VERSION}`);
};

export const addChat = async (db: SQLiteDatabase, title: string) => {
  return await db.runAsync("INSERT INTO chats (title) VALUES (?)", title);
};

export const getChats = async (db: SQLiteDatabase) => {
  return await db.getAllAsync<Chat>("SELECT * FROM chats");
};

export const addMessage = async (
  db: SQLiteDatabase,
  chatId: number,
  message: Message
) => {
  await db.runAsync(
    `INSERT INTO  messages (chat_id, role, content, imageUrl, prompt) 
    VALUES (?, ?, ?, ?, ?)`,
    [
      chatId,
      message.role === Role.Bot ? "bot" : "user",
      message.content,
      message.imageUrl || "",
      message.prompt || "",
    ]
  );
};

export const getMessages = async (db: SQLiteDatabase, chatId: number) => {
  interface MessageDB {
    role: "bot" | "user";
    content: string;
    imageUrl?: string;
    prompt?: string;
  }

  const messages = await db.getAllAsync<MessageDB>(
    "SELECT * FROM messages WHERE chat_id = ?",
    chatId
  );

  return messages.map((message) => ({
    ...message,
    role: message.role === "bot" ? Role.Bot : Role.User,
  }));
};

export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
  return await db.runAsync("DELETE FROM chats WHERE id = ?", chatId);
};

export const renameChat = async (
  db: SQLiteDatabase,
  chatId: number,
  title: string
) => {
  return await db.runAsync("UPDATE chats SET title = ? WHERE id = ?", [
    title,
    chatId,
  ]);
};
