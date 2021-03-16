import { user } from "./user";

export interface attachment {
	type: "image" | "video" | "audio",
	url: string,
}

export interface message {
	sender: user,
	edited: boolean,
	raw_text: string,
	parsed_text: string,
	attachments: attachment[],
	read_by: string[],
	channelId: string,
	created_at: number
	id: string
}