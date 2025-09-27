export type SessionData = {
	token: string;
	level: string;
	user_id: string;
	username: string;
	fullname: string;
	expired_at: Date;
	expired_in: number;
	refresh_token: string;
};
