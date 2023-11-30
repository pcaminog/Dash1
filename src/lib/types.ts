import { message } from 'sveltekit-superforms/client';
import { z } from 'zod';

export const delMonitorSchema = z.object({
	mon_id: z.string().optional()
});
export type delMonitorType = z.infer<typeof delMonitorSchema>;

export const monitorStandardSchema = z.object({
	id: z.string().optional(),
	account_id: z.string().optional(),

	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name cannot have more than 50 characteres' }),
	ssl_verify: z.string().optional(),
	url: z.string().url({ message: 'URL is required.' }),
	method: z.string().min(1, { message: 'Method is required.' }),
	interval: z.string().min(1, { message: 'Interval is required.' }),
	follow_redir: z.string().optional(),
	req_timeout: z.string().min(1, { message: 'Please select a timeout' }),
	req_headers: z.string().optional(),
	authentication: z.string().optional(),
	checks_up: z.number().min(1, { message: 'Please select a number of checks' }),
	checks_down: z.number().min(1, { message: 'Please select a number of checks' })
});

export type monitorStandardType = z.infer<typeof monitorStandardSchema>;

export const monitorCodeSchema = z.object({
	id: z.string().optional(),
	account_id: z.string().optional(),

	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name cannot have more than 50 characteres' }),
	ssl_verify: z.string().optional(),
	checks_up: z.number(),
	checks_down: z.number(),
	url: z.string().url({ message: 'URL is required.' }),
	method: z.string().min(1, { message: 'Method is required.' }),
	interval: z.string().min(1, { message: 'Interval is required.' }),
	follow_redir: z.string().optional(),
	req_timeout: z.string().min(1, { message: 'Please select a timeout' }),
	req_headers: z.string().optional(),
	authentication: z.string().optional(),
	status_code: z
		.number()
		.min(100, { message: 'Status code must be greater than 100' })
		.max(599, { message: 'Status code must be smaller than 600' })
});

export type monitorCodeType = z.infer<typeof monitorCodeSchema>;

export const settingsnotificationEmailSchema = z.object({
	email: z.string().email()
});

export type settingsnotificationEmailSchemaType = z.infer<typeof settingsnotificationEmailSchema>;

export const monitorDNSschema = z.object({
	id: z.string().optional(),
	account_id: z.string().optional(),
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name cannot have more than 50 characteres' }),
	checks_up: z.number().min(1, { message: 'Please select a number of checks' }),
	checks_down: z.number().min(1, { message: 'Please select a number of checks' }),
	interval: z.string().min(1, { message: 'Interval is required.' }),
	hostname: z.string().min(1, { message: 'Hostname is required.' }),
	IPs: z.string()
});

export type monitorDNSType = z.infer<typeof monitorDNSschema>;

export type checkUrlType = {
	url: string;
	ssl_verify: string;
	method: string;
	follow_redir: string;
	req_timeout: string;
	req_headers: {
		name: string;
		value: string;
	}[];
	authentication: {
		name: string;
		value: string;
	};
};

export interface monitorHTTPStandardType {
	id: string;
	account_id: string;
	name: string;
	url: string;
	ssl_verify: boolean;
	follow_redir: boolean;
	method: string;
	req_timeout: number;
	req_headers: reqHeaderType[];
	authentication: reqHeaderType[];
	interval: '30' | '2' | '1';
	checks_down: number;
	checks_up: number;
	open_incident: boolean;
	mon_status: 'active' | 'paused' | 'deleted';
}

export interface monitorHTTPCodeType {
	id: string;
	account_id: string;
	name: string;
	url: string;
	ssl_verify: boolean;
	follow_redir: boolean;
	method: string;
	req_timeout: number;
	req_headers: reqHeaderType[];
	authentication: reqHeaderType[];
	interval: '30' | '2' | '1';
	checks_down: number;
	checks_up: number;
	open_incident: boolean;
	status_code: number;
	mon_status: 'active' | 'paused' | 'deleted';
}

export interface monitorHTTPStandardDBType {
	id: string;
	account_id: string;
	monitor_id: string;
	name: string;
	url: string;
	ssl_verify: boolean;
	follow_redir: boolean;
	method: string;
	req_timeout: number;
	req_headers: reqHeaderType[];
	authentication: reqHeaderType[];
	interval: 30 | 2 | 1;
	checks_down: number;
	checks_up: number;
	open_incident: boolean;
	status_code: number;
	checks: any;
	mon_status: 'active' | 'paused' | 'deleted';
}

export interface monitorHTTPCodeDBType {
	id: string;
	account_id: string;
	monitor_id: string;

	name: string;
	url: string;
	ssl_verify: boolean;
	follow_redir: boolean;
	method: string;
	req_timeout: number;
	req_headers: reqHeaderType[];
	authentication: reqHeaderType[];
	interval: 30 | 2 | 1;
	checks_down: number;
	checks_up: number;
	open_incident: boolean;
	status_code: number;
	checks: any;
	mon_status: 'active' | 'paused' | 'deleted';
}
export interface monitorDNSDBType {
	id: string;
	account_id: string;
	monitor_id: string;
	ips: string;
	checks: any;
	name: string;
	hostname: string;
	dns_error: string;
	interval: 30 | 2 | 1;
	isUpdated: boolean;
	checks_down: number;
	checks_up: number;
	open_incident: boolean;
	status: 'active' | 'paused' | 'deleted';
}

export interface DNSResponse {
	Answer: {
		name: string;
		type: number;
		TTL: number;
		data: string;
	}[];
	Status: number;
	// Include other properties if needed
}
