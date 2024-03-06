const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;

    

    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            /*
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/teams(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/kpi(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/upload(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            `${api}/users/login`,
            `${api}/users/register`
            */
            { url: /(.*)/ },
        ]
    });
}

async function isRevoked(req, payload, done) {

    console.log(payload);

    if (!payload.isAdmin) {
        done(null, true);
    }
    
    done();
}

module.exports = authJwt;