import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Create default admin users for testing
    this.createUser({
      username: "admin",
      email: "admin@firewallai.com",
      password: "$2b$10$rQEk2eDsEJhPK1KZqZ3Im.2f6pUs6Y2.iens0FLZuJjv1Ts/e7yhe", // "password"
      role: "admin"
    });
    
    // Ajout de l'utilisateur de test demandé avec mot de passe 'root'
    this.createUser({
      username: "root",
      email: "root@root.fr",
      password: "888eddc9876765f4b0a227678d1857fbf2865bb5c60367b6824210aeb8a209e7e8be1f1452e31c280d6055e7363e1cf7cc11f37330aaa9113ebbc82ca0f995d0.devtestsalt12345", // 'root'
      role: "admin"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUser(id: number, updates: Partial<Omit<User, 'id'>>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
}

export const storage = new MemStorage();
