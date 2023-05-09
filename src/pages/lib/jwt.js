import jwt from 'jsonwebtoken';




export function signJwtAccessToken(payload) {
    const secret = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret, { algorithm: 'HS256' }, { expiresIn: '1h' });
    console.log('token created' + JSON.stringify(token))
    return token;
}


export function verifyJwt(token) {
    try {
        const secret = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        //jwt not vallid
        console.log(error);
        return null;
    }
}