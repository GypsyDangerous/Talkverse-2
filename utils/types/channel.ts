import { message } from "./message";
import { user } from "./user";

export interface channel {
	last_message: message | null;
	message_count: number;
	name: string;
	description: string;
	id?: string;
	owner: user;
	inviteCodes: string[]
}
