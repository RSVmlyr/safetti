class Login {
    constructor() {
      this.localStorageKey = 'current';
      this.currentHash = this.getStoredHash();
    }
  
    getStoredHash() {
      return localStorage.getItem(this.localStorageKey);
    }
  
    setHash(hash) {
      if (this.currentHash !== hash) {
        this.currentHash = hash;
        localStorage.clear();
        localStorage.setItem(this.localStorageKey, hash);
      }
    }
  
    clearLocalStorage() {
      localStorage.clear();
      localStorage.removeItem(this.localStorageKey);
      this.currentHash = null;
    }
}
export default Login

  