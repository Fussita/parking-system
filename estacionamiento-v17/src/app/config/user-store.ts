import { IUser } from "../interfaces/IUser";

export class UserStore {
  private static store: UserStore
  private data: IUser = init

  static getInstance(): UserStore {
      if (!UserStore.store) this.store = new UserStore()
      return this.store;
  }

  get User() { 
    if (!this.data) throw new Error('Error al Ingresar')
    return this.data 
  }
  
  setUser(data: IUser) {
    this.data = data
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('user', JSON.stringify(this.data));
      }
    } catch (err) {
    }
  }

  cleanUser() {
    this.data = init
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('user');
      }
    } catch (err) {}
  }

  isValid() {
    return !!this.data && !!this.data.token && this.data.id !== 'NONE';
  }

  getUserId(): string | null {
      if (!this.data) return null;
      
      if (this.data.id && this.data.id !== '') return this.data.id;
      if ((this.data as any)._id) return (this.data as any)._id;

      if (this.data.token) {
          try {
              const payloadPart = this.data.token.split('.')[1];
              const payloadDecoded = atob(payloadPart);
              const payload = JSON.parse(payloadDecoded);
              return payload.id || payload._id || payload.sub || null;
          } catch (e) {
              console.error('Error decodificando token para obtener ID', e);
          }
      }
      return null;
  }

  private constructor(){
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.id || parsed._id)) {
            this.data = parsed;
          }
        }
      }
    } catch (err) {
      this.data = init;
    }
  }

}

const init = {
  token: '',
  id: '',
  name: '',
  password: '',  
  role: '',
  email: '',
  accountBalance: 0
}
