class Login {
    constructor() {
      this.localStorageKey = 'current';
      this.currentHash = this.getStoredHash();
    }
  
    getStoredHash() {
      return localStorage.getItem(this.localStorageKey);
    }
  
    setHash(hash,rol) {
      if (this.currentHash !== hash) {
        this.currentHash = hash;
        localStorage.clear();
        localStorage.setItem(this.localStorageKey, hash);
        localStorage.setItem('rol', rol);
      }
    }
  
    clearLocalStorage() {
      localStorage.clear();
      localStorage.removeItem(this.localStorageKey);
      this.currentHash = null;
    }
}
export default Login

  