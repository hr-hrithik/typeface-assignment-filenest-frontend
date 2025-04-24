import { DB_STORES } from '@/IndexedDB/DBConfigurations';

export class IndexedDBManager {
  db: IDBDatabase | undefined = undefined;
  db_version: number = 1;
  db_name: string = '';

  constructor(db_name: string, db_version: number) {
    this.db_name = db_name;
    this.db_version = db_version;
  }

  async createDB(db_name: string, db_version: number): Promise<IDBDatabase> {
    return new Promise(async (resolve, reject) => {
      try {
        const request: IDBOpenDBRequest = window.indexedDB.open(
          db_name,
          db_version,
        );

        request.onerror = event => {
          console.error('Error in opening Indexed DB', event);
          reject(new Error('Error opening database.'));
        };

        request.onsuccess = (event: any) => {
          this.db = request?.result;
          resolve(this.db);
        };

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event?.target as IDBOpenDBRequest)?.result;

          Object.values(DB_STORES)?.map(db_store_name => {
            if (!db?.objectStoreNames?.contains(db_store_name)) {
              const objectStore = db.createObjectStore(db_store_name);
            }
          });
        };
      } catch (error) {
        reject(new Error('Error opening database.'));
        console.error('ERROR IN OPENING INDEXED DB :: ', error);
      }
    });
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) {
      return Promise.resolve(this.db);
    } else {
      return this.createDB(this.db_name, this.db_version);
    }
  }

  public async putData(
    storeName: string,
    key: string,
    value: any,
  ): Promise<boolean> {
    if (typeof key !== 'string') {
      return false;
    }

    return new Promise(async (resolve, reject) => {
      const db = await this.getDB();

      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      const request = store.put(value, key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  public async getData(storeName: string, key: string): Promise<any> {
    const db = await this.getDB();

    return new Promise(resolve => {
      if (typeof key !== 'string') {
        resolve(undefined);
      }

      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(undefined);
    });
  }

  public async deleteData(
    storeName: string,
    key: IDBValidKey,
  ): Promise<boolean> {
    const db = await this.getDB();

    return new Promise(resolve => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  public async deleteAllData(storeName: string): Promise<boolean> {
    const db = await this.getDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const allStoreKeysRequest = store.getAllKeys();

      allStoreKeysRequest.onsuccess = () => {
        const allStoreKeys = allStoreKeysRequest.result;

        Promise.all(
          allStoreKeys.map(key => {
            return new Promise<void>((resolve, reject) => {
              const deleteRequest = store.delete(key);
              deleteRequest.onsuccess = () => resolve();
              deleteRequest.onerror = () =>
                reject(new Error('Error deleting data.'));
            });
          }),
        )
          .then(() => resolve(true))
          .catch(err => resolve(false));
      };

      allStoreKeysRequest.onerror = () => resolve(false);
    });
  }
}
