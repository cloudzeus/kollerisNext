import jwt from 'jsonwebtoken';




export function signJwtAccessToken(payload) {
    const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
    const token = jwt.sign(payload, secret, { algorithm: 'HS256' }, { expiresIn: '1h' });
    return token;
}


export function verifyJwt(token) {
    try {
        const secret = process.env.NEXT_PUBLIC_SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        //jwt not vallid
        return null;
    }
}