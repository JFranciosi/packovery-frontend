const PROXY_CONFIG = {
    "/auth": {
        "target": "http://localhost:8080",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug"
    },
    "/order": {
        "target": "http://localhost:8080",
        "secure": false,
        "changeOrigin": true,
        "logLevel": "debug",
        "bypass": function (req, res, proxyOptions) {
            // Se la richiesta è per una pagina HTML (navigazione browser), non proxare.
            // Questo evita che rotte frontend come /order-search vengano mandate al backend.
            if (req.headers.accept && req.headers.accept.indexOf("html") !== -1) {
                console.log("Skipping proxy for browser request:", req.url);
                return "/index.html";
            }
            return null; // Continua con il proxy
        }
    }
};

module.exports = PROXY_CONFIG;
