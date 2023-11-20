import { SES_KEY_ID, SES_SECRET_KEY } from '$env/static/private';
import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';

type ValidationResult = { isValid: boolean; reason?: string };
export const isValidEmail = (email: string): ValidationResult => {
	const normalizedEmail = email.toLowerCase();
	if (normalizedEmail.includes('+')) {
		return { isValid: false, reason: 'Email contains a plus sign (+), which is not allowed.' };
	}
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const match = normalizedEmail.match(emailRegex);

	if (match) {
		return { isValid: true };
	} else {
		return { isValid: false, reason: 'Email is malformed.' };
	}
};

export const sendEmailVerificationLink = async (email: string, token: string) => {
	const input = {
		Source: 'HostnameNotifier Notification <notifications@hostnamenotifier.com>',
		Destination: {
			ToAddresses: [email]
		},
		Template: 'email_validate_00',
		TemplateData: JSON.stringify({
			token: token
		})
	};
	const command = new SendTemplatedEmailCommand(input);
	const response = await client.send(command);
	if (response.$metadata.httpStatusCode != 200) {
		return { success: false, message: 'response.$metadata' };
	}
};

export const client = new SESClient({
	region: 'us-east-1',
	credentials: {
		secretAccessKey: SES_SECRET_KEY,
		accessKeyId: SES_KEY_ID
	}
});
