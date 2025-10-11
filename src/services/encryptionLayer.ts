import { randomBytes, createCipheriv, createDecipheriv, pbkdf2 } from "crypto";
import { promisify } from "util";
import type { EncryptionLayer, EncryptedPayload } from "../types/sync";

const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;

const pbkdf2Async = promisify(pbkdf2);

const getKey = async (secret?: string, salt?: Buffer): Promise<{ key: Buffer; salt: Buffer }> => {
  if (secret) {
    const keySalt = salt || randomBytes(SALT_LENGTH);
    const key = await pbkdf2Async(secret, keySalt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha256");
    return { key: key as Buffer, salt: keySalt };
  }
  return { key: randomBytes(KEY_LENGTH), salt: randomBytes(SALT_LENGTH) };
};

export class AesEncryptionLayer implements EncryptionLayer {
  private keyPromise: Promise<{ key: Buffer; salt: Buffer }>;

  constructor(secret?: string) {
    this.keyPromise = getKey(secret);
  }

  async encrypt<T>(payload: T): Promise<EncryptedPayload> {
    const { key } = await this.keyPromise;
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
    const { key } = await this.keyPromise;
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
