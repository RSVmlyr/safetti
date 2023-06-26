class ExpiringLocalStorage {
    static saveDataWithExpiration(key, value, expirationTime) {
        const item = {
        value: value,
        expiration: Date.now() + expirationTime
        };
        localStorage.setItem(key, JSON.stringify(item));
    }

    static getDataWithExpiration(key) {
        const item = localStorage.getItem(key);
        if (item) {
        const parsedItem = JSON.parse(item);
        if (parsedItem.expiration > Date.now()) {
            return parsedItem.value;
        } else {
            localStorage.removeItem(key);
        }
        }
        return null;
    }
}
export default ExpiringLocalStorage;
  