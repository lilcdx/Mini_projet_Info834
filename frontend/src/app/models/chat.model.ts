export class Chat {
    id!: number;
    idUser1!: number;
    idUser2!: number;
  
    constructor(
        id: number,
        idUser1: number,
        idUser2: number,

    ) {
        this.id = id;
        this.idUser1 = idUser1;
        this.idUser2 = idUser2;
    }
  
  }
  