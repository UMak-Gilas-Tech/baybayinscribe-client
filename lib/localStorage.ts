export class LocalStorageService {
	// Check if localStorage is available in this environment
	private static isLocalStorageAvailable(): boolean {
		try {
			const testKey = '__test_key__';
			window.localStorage.setItem(testKey, 'test');
			window.localStorage.removeItem(testKey);
			return true;
		} catch (e) {
			return false;
		}
	}

	// Create or Update an item
	static setItem(key: string, value: any): void {
		if (!LocalStorageService.isLocalStorageAvailable()) {
			console.error('LocalStorage is not available.');
			return;
		}
		try {
			const serializedValue = JSON.stringify(value);
			window.localStorage.setItem(key, serializedValue);
		} catch (error) {
			console.error(`Error setting item '${key}':`, error);
		}
	}

	// Read an item using generics
	static getItem<T>(key: string): T | null {
		if (!LocalStorageService.isLocalStorageAvailable()) {
			console.error('LocalStorage is not available.');
			return null;
		}
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) as T : null;
		} catch (error) {
			console.error(`Error getting item '${key}':`, error);
			return null;
		}
	}

	// Delete an item
	static removeItem(key: string): void {
		if (!LocalStorageService.isLocalStorageAvailable()) {
			console.error('LocalStorage is not available.');
			return;
		}
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error(`Error removing item '${key}':`, error);
		}
	}

	// Clear all items
	static clear(): void {
		if (!LocalStorageService.isLocalStorageAvailable()) {
			console.error('LocalStorage is not available.');
			return;
		}
		try {
			window.localStorage.clear();
		} catch (error) {
			console.error('Error clearing localStorage:', error);
		}
	}
}