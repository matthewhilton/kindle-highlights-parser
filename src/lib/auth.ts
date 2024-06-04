import jwt from 'jsonwebtoken'

const key = import.meta.env.JWT_SIGNING_KEY || "changeme!";
const expiry = import.meta.env.JWT_EXPIRY || 30 * 60;

export function create_jwt(): string {
    const nonce = crypto.randomUUID();

    // Generate a JWT token.
    // We don't properly auth users at the moment, we just give them a jwt for easy session tracking.
    var token = jwt.sign({
        nonce: nonce
    }, key, { expiresIn: expiry });

    return token;
}

export function is_jwt_valid(jwt_string: string): boolean {
    try {
        jwt.verify(jwt_string, key)
        return true;
    } catch {
        return false;
    }
}