import axios, { AxiosResponse } from "axios";

import User from "../models/User";

// @TODO remove
// @ts-ignore
window.axios = axios;

let instance: Auth | null = null;

class Auth {
  private _user: User | null = null;

  constructor() {
    if (instance) return instance;

    instance = this;
    axios.defaults.withCredentials = true;
    this.getSanctumCookie();
  }

  // Get X-XSRF-TOKEN
  getSanctumCookie() {
    axios.defaults.withCredentials = true;
    axios.get("/sanctum/csrf-cookie").then(() => {}); // console.log(document.cookie)
  }

  public authenticate(): Promise<User> {
    return new Promise((resolve, reject) => {
      if (this._user) {
        resolve(this._user);
        return;
      }

      axios
        .post("/api/user")
        .then(async (response) => {
          this._user = response.data;

          resolve(response.data);
        })
        .catch((e) => reject(e));
    });
  }

  public get user(): User | null {
    return this._user;
  }

  public isAuthenticated(): boolean {
    return this._user != null;
  }

  public login(credentials: Credentials): Promise<User> {
    console.log(credentials);
    return new Promise((resolve, reject) => {
      axios
        .post("/login", credentials)
        .then((response) => {
          console.log(response.data);
          console.log(response.status);

          if (response.status === 422)
            reject({ error: "Authentication failed. Check your credentials." });
          // Get user
          if (response.status === 200)
            this.authenticate()
              .then((_user) => resolve(_user))
              .catch(reject);
        })
        .catch((e) => reject(e));
    });
  }

  public logout(): Promise<AxiosResponse<any>> {
    return axios.post("/logout");
  }
}

export default Auth;

interface Credentials {
  email: string;
  password: string;
  rememberMe: boolean;
}
