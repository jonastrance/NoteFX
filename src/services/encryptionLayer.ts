import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import type { EncryptionLayer, EncryptedPayload } from "../types/sync";

const IV_LENGTH = 16;
const KEY_LENGTH = 32;

const getKey = async (secret?: string) => {
  if (secret) {
    return Buffer.from(secret.padEnd(KEY_LENGTH * 2, "0").slice(0, KEY_LENGTH * 2), "hex");
  }
  return randomBytes(KEY_LENGTH);
};

export class AesEncryptionLayer implements EncryptionLayer {
  private keyPromise: Promise<Buffer>;

  constructor(secret?: string) {
    this.keyPromise = getKey(secret);
  }

  async encrypt<T>(payload: T): Promise<EncryptedPayload> {
    const key = await this.keyPromise;
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const json = JSON.stringify(payload);
    const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return {
      iv: iv.toString("base64"),
      data: encrypted.toString("base64"),
      authTag: authTag.toString("base64")
    };
  }

  async decrypt<T>(payload: EncryptedPayload): Promise<T> {
    const key = await this.keyPromise;
    const iv = Buffer.from(payload.iv, "base64");
    const encryptedText = Buffer.from(payload.data, "base64");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    if (payload.authTag) {
      decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));
    }
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return JSON.parse(decrypted.toString("utf8"));
  }
}

export class PassthroughEncryptionLayer implements EncryptionLayer {
  async encrypt<T>(payload: T): Promise<EncryptedPayload> {
    return {
      iv: "",
      data: Buffer.from(JSON.stringify(payload)).toString("base64")
    };
  }

  async decrypt<T>(payload: EncryptedPayload): Promise<T> {
    return JSON.parse(Buffer.from(payload.data, "base64").toString("utf8"));
  }
}
