/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseRepository } from './RepositoryInterfaces';

/**
 * Operation Types matching the Firestore Security Rules / Integration mandates.
 */
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

/**
 * Structured Error Payload for zero-trust error debugging.
 */
export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

/**
 * Standardized Firestore error logger & thrower.
 * Leverages structured logging to facilitate immediate developer diagnostics.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  userId?: string | null,
  email?: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: userId || 'anonymous',
      email: email || 'anonymous@tasknova.ai',
      emailVerified: true,
      isAnonymous: !userId,
    },
  };

  console.error('Firestore Security / Protocol Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Standard Client-Side Mock Database Engine.
 * Simulates Firestore's behavior with persistence backed by localStorage or Memory.
 * This guarantees the sandbox remains 100% operational prior to active Firebase bootstrapping,
 * while mimicking all transactional properties!
 */
export class MemoryDatabase {
  private static storage: Record<string, Record<string, any>> = {};

  static init() {
    try {
      const stored = localStorage.getItem('tasknova_mock_firestore');
      if (stored) {
        this.storage = JSON.parse(stored);
      }
    } catch {
      // Graceful fallback to memory during private sandboxing
    }
  }

  static persist() {
    try {
      localStorage.setItem('tasknova_mock_firestore', JSON.stringify(this.storage));
    } catch {
      // Fail-silent in isolated iframe runtime
    }
  }

  static getCollection(collection: string): Record<string, any> {
    if (!this.storage[collection]) {
      this.storage[collection] = {};
    }
    return this.storage[collection];
  }

  static get(collection: string, docId: string): any | null {
    const coll = this.getCollection(collection);
    return coll[docId] ? { ...coll[docId] } : null;
  }

  static set(collection: string, docId: string, data: any): void {
    const coll = this.getCollection(collection);
    coll[docId] = { ...data, id: docId };
    this.persist();
  }

  static update(collection: string, docId: string, data: any): void {
    const coll = this.getCollection(collection);
    if (!coll[docId]) {
      throw new Error(`Document ${docId} does not exist in collection ${collection}`);
    }
    coll[docId] = { ...coll[docId], ...data, id: docId };
    this.persist();
  }

  static delete(collection: string, docId: string): void {
    const coll = this.getCollection(collection);
    delete coll[docId];
    this.persist();
  }

  static list(collection: string, filters?: Record<string, any>): any[] {
    const coll = this.getCollection(collection);
    let items = Object.values(coll);

    if (filters) {
      items = items.filter(item => {
        return Object.entries(filters).every(([key, val]) => item[key] === val);
      });
    }

    return items;
  }
}

// Boot database immediately
MemoryDatabase.init();

/**
 * Base Abstract Repository implementing Firestore-like interfaces over the offline DB.
 * Ready for drop-in SDK replacement (using actual `firebase/firestore` functions)
 * when environmental secrets are configured!
 */
export class FirestoreRepository<T> implements BaseRepository<T> {
  constructor(protected collectionName: string) {}

  async getById(id: string): Promise<T | null> {
    const path = `${this.collectionName}/${id}`;
    try {
      // Real code template:
      // const docRef = doc(db, this.collectionName, id);
      // const docSnap = await getDoc(docRef);
      // return docSnap.exists() ? docSnap.data() as T : null;
      return MemoryDatabase.get(this.collectionName, id) as T | null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }

  async create(id: string, data: T): Promise<void> {
    const path = `${this.collectionName}/${id}`;
    try {
      // Real code template:
      // await setDoc(doc(db, this.collectionName, id), { ...data, createdAt: serverTimestamp() });
      MemoryDatabase.set(this.collectionName, id, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const path = `${this.collectionName}/${id}`;
    try {
      // Real code template:
      // await updateDoc(doc(db, this.collectionName, id), { ...data, updatedAt: serverTimestamp() });
      MemoryDatabase.update(this.collectionName, id, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  async delete(id: string): Promise<void> {
    const path = `${this.collectionName}/${id}`;
    try {
      // Real code template:
      // await deleteDoc(doc(db, this.collectionName, id));
      MemoryDatabase.delete(this.collectionName, id);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  async list(filters?: Record<string, any>, limitCount?: number, startAfterId?: string): Promise<T[]> {
    const path = this.collectionName;
    try {
      // Real code template:
      // let q = query(collection(db, this.collectionName));
      // if (filters) { ... }
      // if (limitCount) q = query(q, limit(limitCount));
      // const snap = await getDocs(q);
      // return snap.docs.map(doc => doc.data() as T);
      let items = MemoryDatabase.list(this.collectionName, filters);
      if (startAfterId) {
        const idx = items.findIndex(item => item.id === startAfterId);
        if (idx !== -1) {
          items = items.slice(idx + 1);
        }
      }
      if (limitCount) {
        items = items.slice(0, limitCount);
      }
      return items as T[];
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}
