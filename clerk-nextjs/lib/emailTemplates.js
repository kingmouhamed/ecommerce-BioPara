/**
 * Email Templates Stub
 * Created to fix Next.js build errors.
 */

const emailTemplates = {
    passwordReset: ({ name, resetUrl, token }) => {
        return `<h1>Password Reset</h1><p>Hi ${name}, click <a href="${resetUrl}">here</a> to reset your password. Token: ${token}</p>`;
    },
    emailVerification: ({ name, verificationUrl, token }) => {
        return `<h1>Verify Email</h1><p>Hi ${name}, click <a href="${verificationUrl}">here</a> to verify your email. Token: ${token}</p>`;
    },
    welcome: ({ name, email, welcomeUrl }) => {
        return `<h1>Welcome to BioPara</h1><p>Hi ${name}, welcome aboard! <a href="${welcomeUrl}">Start shopping</a></p>`;
    }
};

export default emailTemplates;
