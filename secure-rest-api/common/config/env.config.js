module.exports = {
    "port": 5000,
    "appEndpoint": "http://localhost:5000",
    "apiEndpoint": "http://localhost:5000",
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    }
};
