/**
 * There is exactly one shared admin account (not one per person). Supabase
 * Auth still needs an email internally, but the login screen only asks for
 * the password — this is the fixed email behind it.
 */
export const ADMIN_EMAIL = "admin@emaraacademy.org";
