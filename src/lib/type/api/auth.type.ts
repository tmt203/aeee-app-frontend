import type { AuditInfo } from "@type/common.type";

export type SessionData = {
	id: string;
	token: string;
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	avatar: string;
	role: string;
} & AuditInfo;

export type RegisterBody = {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
	confirm_password: string;
};

export type Register = {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	avatar: string;
	role: string;
	active: boolean;
} & AuditInfo;

export type LoginBody = {
	identifier: string;
	password: string;
};
