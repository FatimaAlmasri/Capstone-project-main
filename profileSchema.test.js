import assert from 'node:assert/strict';
import test from 'node:test';
import { profileSchema } from './profileSchema.js';

const validProfile = {
	name: 'Alex Morgan',
	email: 'alex@example.com',
	bio: 'Product designer.',
};

test('accepts a valid profile and trims surrounding whitespace', () => {
	const result = profileSchema.safeParse({
		name: ' Alex Morgan ',
		email: ' alex@example.com ',
		bio: ' Product designer. ',
	});

	assert.equal(result.success, true);
	assert.deepEqual(result.data, validProfile);
});

test('rejects a name shorter than two characters', () => {
	const result = profileSchema.safeParse({ ...validProfile, name: ' ' });

	assert.equal(result.success, false);
	assert.equal(result.error.issues[0].path[0], 'name');
});

test('rejects an invalid email address', () => {
	const result = profileSchema.safeParse({ ...validProfile, email: 'not-an-email' });

	assert.equal(result.success, false);
	assert.equal(result.error.issues[0].path[0], 'email');
});

test('rejects a bio longer than 160 characters', () => {
	const result = profileSchema.safeParse({ ...validProfile, bio: 'a'.repeat(161) });

	assert.equal(result.success, false);
	assert.equal(result.error.issues[0].path[0], 'bio');
});

test('allows an empty optional bio', () => {
	const result = profileSchema.safeParse({ ...validProfile, bio: '' });

	assert.equal(result.success, true);
});