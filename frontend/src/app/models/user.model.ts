export class User {
    id!: number;
    username!: string;
    email!: string;
    password!: string;
    photo_url!: string;
    online!: boolean;
  
    constructor(
      id: number,
      username: string,
      email: string,
      password: string,
      photo_url: string,
      online: boolean,
    ) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;
      this.photo_url = photo_url;
      this.online = online;
    }
  
  }
  