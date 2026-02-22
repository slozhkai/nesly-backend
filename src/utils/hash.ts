import bcrypt from 'bcrypt';

// Для смеха
export const getHash = async (value: string, salt: number): Promise<string> =>
  bcrypt.hash(value, salt);
