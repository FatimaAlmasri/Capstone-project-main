import { z } from 'zod';

export const profileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, 'Enter a name with at least 2 characters.')
		.max(80, 'Name must be 80 characters or fewer.'),
	email: z
		.string()
		.trim()
		.min(1, 'Enter your email address.')
		.email('Enter a valid email address.')
		.max(254, 'Email must be 254 characters or fewer.'),
	bio: z.string().trim().max(160, 'Bio must be 160 characters or fewer.'),
});