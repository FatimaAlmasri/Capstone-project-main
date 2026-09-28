import { useState } from 'react';
import './SettingForm.css';

const defaultProfile = {
	name: 'Alex Morgan',
	username: 'alexmorgan',
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
	const [profile, setProfile] = useState(() => ({ ...defaultProfile, ...initialProfile }));
	const [saved, setSaved] = useState(false);

	function updateField(event) {
		const { name, value } = event.target;
		setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
		setSaved(false);
	}

	function handleSubmit(event) {
		event.preventDefault();
		onSave?.(profile);
		setSaved(true);
	}

	function handleReset() {
		setProfile({ ...defaultProfile, ...initialProfile });
		setSaved(false);
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
					<div className="profile-settings__identity">
						<div className="profile-settings__avatar" aria-hidden="true">
							{getInitials(profile.name) || 'U'}
						</div>
						<div>
							<p className="profile-settings__identity-name">{profile.name || 'Your name'}</p>
							<p className="profile-settings__identity-handle">@{profile.username || 'username'}</p>
						</div>
					</div>
				</header>

				<form className="profile-form" onSubmit={handleSubmit}>
					<div className="profile-form__heading">
						<div>
							<h2>Personal information</h2>
							<p>Update the details associated with your profile.</p>
						</div>
						<span className="profile-form__required-note">* Required</span>
					</div>

					<div className="profile-form__fields">
						<label className="profile-form__field" htmlFor="profile-name">
							<span>Full name <span aria-hidden="true">*</span></span>
							<input
								autoComplete="name"
								id="profile-name"
								name="name"
								onChange={updateField}
								required
								value={profile.name}
							/>
						</label>

						<label className="profile-form__field" htmlFor="profile-username">
							<span>Username <span aria-hidden="true">*</span></span>
							<div className="profile-form__input-prefix">
								<span aria-hidden="true">@</span>
								<input
									autoComplete="username"
									id="profile-username"
									name="username"
									onChange={updateField}
									pattern="[A-Za-z0-9_]{3,20}"
									required
									title="Use 3–20 letters, numbers, or underscores."
									value={profile.username}
								/>
							</div>
							<small>3–20 characters. Letters, numbers, and underscores only.</small>
						</label>

						<label className="profile-form__field" htmlFor="profile-email">
							<span>Email address <span aria-hidden="true">*</span></span>
							<input
								autoComplete="email"
								id="profile-email"
								name="email"
								onChange={updateField}
								required
								type="email"
								value={profile.email}
							/>
						</label>

						<label className="profile-form__field" htmlFor="profile-bio">
							<span>About you</span>
							<textarea
								id="profile-bio"
								maxLength={180}
								name="bio"
								onChange={updateField}
								rows={4}
								value={profile.bio}
							/>
							<small className="profile-form__counter">{profile.bio.length}/180</small>
						</label>
					</div>

					<div className="profile-form__footer">
						<p className="profile-form__status" aria-live="polite">
							{saved ? 'Your profile has been saved.' : ''}
						</p>
						<div className="profile-form__actions">
							<button className="profile-form__reset" onClick={handleReset} type="button">
								Discard changes
							</button>
							<button className="profile-form__submit" type="submit">
								Save changes <span aria-hidden="true">↗</span>
							</button>
						</div>
					</div>
				</form>
			</div>
		</main>
	);
}
