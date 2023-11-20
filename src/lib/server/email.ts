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

export const sendEmailVerificationLink = async (token: string) => {
	const url = `http://localhost:5173/email-verification/${token}`;
	console.log(`Your email verification link: ${url}`);
};