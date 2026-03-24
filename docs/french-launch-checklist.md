# French Launch Checklist

## Goal

Use this checklist to verify the English and French rollout before release.

## Frontend

- Confirm the language switcher changes the UI between `English` and `French`.
- Confirm the selected language persists after page refresh.
- Confirm `Navbar` and `Footer` update correctly in both languages.
- Confirm customer-facing pages render correctly in French with no broken layout or overflow.
- Confirm seller-facing pages render correctly in French.
- Confirm admin pages render correctly in French.
- Confirm shared UI elements like dialogs, carousels, breadcrumbs, and notifications show translated text.
- Confirm no obvious hardcoded English appears in active user flows.

## Customer Flow

- Register a new user in English and confirm the UI is English.
- Register a new user in French and confirm the UI is French.
- Log in in English and confirm success/error messages are correct.
- Log in in French and confirm success/error messages are correct.
- Browse categories, product list, product details, cart, checkout, and order confirmation in French.
- Confirm account pages, wishlist, reviews, help pages, and public content pages display French properly.

## Email Flow

- Register a new English user and confirm the verification email arrives in English.
- Register a new French user and confirm the verification email arrives in French.
- Use `resend verification` in English and French and confirm the email language matches.
- Request password reset in English and confirm the reset email is English.
- Request password reset in French and confirm the reset email is French.
- Verify a user email in English and confirm the welcome email is English.
- Verify a user email in French and confirm the welcome email is French.

## Admin Email Flow

- Reset an admin password and confirm the email sends successfully.
- Reset a user password from admin and confirm the email sends successfully.
- Reset a seller password from admin and confirm the email sends successfully.
- Confirm those emails still work after the mail template refactor.

## Data And Persistence

- Confirm newly registered users store `preferredLanguage` correctly.
- Confirm existing users without `preferredLanguage` still default safely to English.
- Confirm admins without `preferredLanguage` still default safely to English.

## Technical Checks

- Confirm frontend production build passes with `npm run build` in `frontend`.
- Confirm backend changed files pass syntax checks.
- Confirm no console errors appear in critical flows.
- Confirm mail provider environment variables are present in the deployment environment.

## Release Sign-Off

- QA sign-off on English flow.
- QA sign-off on French flow.
- QA sign-off on user emails.
- QA sign-off on admin-triggered emails.
- Product sign-off on translated copy.
- Release sign-off recorded with date and owner.

## Notes

- Literal business data such as company name, email addresses, URLs, payment brand names, and physical addresses do not need translation.
- If any new user-facing page or email is added after this point, it should be added to both frontend i18n and backend mail templates before release.
