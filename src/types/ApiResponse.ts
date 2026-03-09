import { Message } from "@/models/User.model";

export interface ApiResponse{
    sucess:Boolean;
    message:string;
    isAcceptingMessages?:boolean
    messages?:Array<Message>
}