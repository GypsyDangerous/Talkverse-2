import { message } from "./message";

export interface channel {
	last_message: message,
	message_count: number,
	name: string,
	description: string,
}