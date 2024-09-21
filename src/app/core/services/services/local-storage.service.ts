import { Injectable} from '@angular/core';


@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  //store into local storage
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  // fetch from local storage
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  // remove from local storage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // Clear all from local storage
  clear(): void {
    localStorage.clear();
  }
}