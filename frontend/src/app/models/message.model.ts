export class Message {
    id!: number;
    idChat!: number;
    content!: String;
    timestamp!: Date;
    idSender!: number;

    constructor(
        id: number,
        idChat: number,
        content: String,
        timestamp: Date,
        idSender: number


    ) {
        this.id = id;
        this.idChat = idChat;
        this.content = content;
        this.timestamp = timestamp;
        this.idSender = idSender;
    }

}
