import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { profileSchema } from './profileSchema.js';
import './SettingForm.css';

const defaultProfile = {
	name: 'Alex Morgan',
	email: 'alex@example.com',
	bio: 'Product designer turning complex problems into simple, thoughtful experiences.',
};

function getInitials(name) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? '')
		.join('');
}

export default function SettingForm({ initialProfile = defaultProfile, onSave }) {
	const [saved, setSaved] = useState(false);
	const [saveError, setSaveError] = useState('');
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: { ...defaultProfile, ...initialProfile },
		mode: 'onBlur',
		reValidateMode: 'onChange',
		resolver: zodResolver(profileSchema),
		shouldFocusError: true,
	});
	const name = watch('name') ?? '';
	const bio = watch('bio') ?? '';

	async function saveProfile(profile) {
		setSaved(false);
		setSaveError('');

		try {
			await onSave?.(profile);
			setSaved(true);
		} catch {
			setSaveError('Your profile could not be saved. Please try again.');
		}
	}

	function discardChanges() {
		reset({ ...defaultProfile, ...initialProfile });
		setSaved(false);
		setSaveError('');
	}

	return (
		<main className="profile-settings">
			<div className="profile-settings__layout">
				<header className="profile-settings__intro">
					<p className="profile-settings__eyebrow">YOUR ACCOUNT</p>
					<h1>Profile settings</h1>
					<p className="profile-settings__description">
						Keep your personal details current so people know who they’re working with.
					</p>
					<div className="profile-settings__identity" aria-label="Profile preview">
						<div className="profile-settings__avatar" aria-hidden="true">
							{getInitials(name) || 'U'}
						</div>
						<p className="profile-settings__identity-name">{name || 'Your name'}</p>
					</div>
				</header>

				<form className="profile-form" noValidate onSubmit={handleSubmit(saveProfile)}>
					<div className="profile-form__heading">
						<div>
							<h2>Personal information</h2>
							<p>Update the details associated with your profile.</p>
						</div>
						<span className="profile-form__required-note">
							<span aria-hidden="true">*</span> Required
						</span>
					</div>

					<div className="profile-form__fields">
						<div className="profile-form__field">
							<label htmlFor="profile-name">Full name <span aria-hidden="true">*</span></label>
							<input
								{...register('name', { onChange: () => { setSaved(false); setSaveError(''); } })}
								aria-describedby={errors.name ? 'profile-name-error' : undefined}
								aria-invalid={errors.name ? 'true' : 'false'}
								autoComplete="name"
								id="profile-name"
								maxLength={80}
								aria-required="true"
							/>
							{errors.name && <p className="profile-form__error" id="profile-name-error" role="alert">{errors.name.message}</p>}
						</div>

						<div className="profile-form__field">
							<label htmlFor="profile-email">Email address <span aria-hidden="true">*</span></label>
							<input
								{...register('email', { onChange: () => { setSaved(false); setSaveError(''); } })}
								aria-describedby={errors.email ? 'profile-email-error' : undefined}
								aria-invalid={errors.email ? 'true' : 'false'}
								autoComplete="email"
								id="profile-email"
								maxLength={254}
								aria-required="true"
							/>
							{errors.email && <p className="profile-form__error" id="profile-email-error" role="alert">{errors.email.message}</p>}
						</div>

						<div className="profile-form__field profile-form__field--bio">
							<label htmlFor="profile-bio">Short bio <span className="profile-form__optional">(optional)</span></label>
							<textarea
								{...register('bio', { onChange: () => { setSaved(false); setSaveError(''); } })}
								aria-describedby={`profile-bio-hint profile-bio-count${errors.bio ? ' profile-bio-error' : ''}`}
								aria-invalid={errors.bio ? 'true' : 'false'}
								id="profile-bio"
								maxLength={160}
								rows={4}
							/>
							<div className="profile-form__bio-meta">
								<small id="profile-bio-hint">Share a little about yourself. 160 characters maximum.</small>
								<small id="profile-bio-count" aria-live="polite">{bio.length}/160</small>
							</div>
							{errors.bio && <p className="profile-form__error" id="profile-bio-error" role="alert">{errors.bio.message}</p>}
						</div>
					</div>

					<div className="profile-form__footer">
						<div className="profile-form__messages" aria-live="polite">
							{saved && <p className="profile-form__status">Your profile has been saved.</p>}
							{saveError && <p className="profile-form__error" role="alert">{saveError}</p>}
						</div>
						<div className="profile-form__actions">
							<button className="profile-form__reset" onClick={discardChanges} type="button" disabled={isSubmitting}>
								Discard changes
							</button>
							<button className="profile-form__submit" type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Saving…' : 'Save changes'}
							</button>
						</div>
					</div>
				</form>
			</div>
		</main>
	);
}