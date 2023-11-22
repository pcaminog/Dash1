import { z } from 'zod';

export const monitorformSchema = z.object({
	id: z.string().optional(),

	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, { message: 'Name cannot have more than 50 characteres' }),
	type: z.enum(['standard', 'codespecific'], {
		errorMap: (issue, ctx) => ({ message: 'Please select a monitor type.' })
	}),
	ssl_verify: z.string().optional(),
	url: z.string().url({ message: 'URL is required.' }),
	method: z.string().min(1, { message: 'Method is required.' }),
	interval: z.string().min(1, { message: 'Interval is required.' }),
	follow_redir: z.string().optional(),
	req_timeout: z.string().min(1, { message: 'Please select a timeout' }),
	req_headers: z.string().optional(),
	authentication: z.string().optional(),
	status_code: z.number().min(100).max(599).optional()
});

export type monitorType = z.infer<typeof monitorformSchema>;

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
