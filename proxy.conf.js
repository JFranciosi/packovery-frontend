const PROXY_CONFIG = {
    "/auth": {
        "target": "http://127.0.0.1:8080",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/order": {
        "target": "http://127.0.0.1:8080",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "bypass": function (req, res, proxyOptions) {
            if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
                return "/index.html";
            }
            return null;
        }
    },
    "/alert": {
        "target": "http://127.0.0.1:8080",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "bypass": function (req, res, proxyOptions) {
            if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
                return "/index.html";
            }
            return null;
        }
    }
};

module.exports = PROXY_CONFIG;
