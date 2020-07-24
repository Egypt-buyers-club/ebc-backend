export const generateVerificationCode = (): number =>
	Math.floor(100000 + Math.random() * 900000);
