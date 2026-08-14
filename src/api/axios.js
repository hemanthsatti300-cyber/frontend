import axios from "axios";

/* ======================================================
   AXIOS INSTANCE
====================================================== */

const API = axios.create({
    baseURL: "https://backend-production-9ab6.up.railway.app/api",

    timeout: 15000,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

/* ======================================================
   PUBLIC ENDPOINTS

   These endpoints do NOT require JWT.
====================================================== */

const PUBLIC_ENDPOINTS = [
    "/auth/login",
    "/auth/register",
    "/auth/verify",
];

/* ======================================================
   CHECK PUBLIC ENDPOINT
====================================================== */

const isPublicEndpoint = (url = "") => {

    /*
       Axios config.url can sometimes be:
       /auth/login
       or
       http://localhost:8080/api/auth/login

       Therefore we extract only the API path.
    */

    let pathname = url;

    try {

        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {
            pathname = new URL(url).pathname;
        }

    } catch {

        console.warn(
            "Unable to parse API URL:",
            url
        );

    }

    /*
       Remove /api prefix if it exists.
    */

    pathname = pathname.replace(
        /^\/api/,
        ""
    );

    return PUBLIC_ENDPOINTS.some(
        (endpoint) =>
            pathname === endpoint ||
            pathname.startsWith(
                endpoint + "/"
            )
    );
};

/* ======================================================
   REQUEST INTERCEPTOR
====================================================== */

API.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        config.headers =
            config.headers || {};

        const publicEndpoint =
            isPublicEndpoint(
                config.url
            );

        /* ==============================================
           JWT
        ============================================== */

        if (
            !publicEndpoint &&
            token
        ) {

            config.headers.Authorization =
                `Bearer ${token}`;

        } else {

            /*
               Make sure public requests do not
               accidentally receive an old JWT.
            */

            if (
                config.headers.Authorization
            ) {

                delete config.headers.Authorization;

            }

        }

        /* ==============================================
           DEBUG LOGGING
        ============================================== */

        console.groupCollapsed(
            `🚀 ${config.method?.toUpperCase()} ${config.url}`
        );

        console.log(
            "Base URL:",
            config.baseURL
        );

        console.log(
            "Full URL:",
            `${config.baseURL || ""}${config.url || ""}`
        );

        console.log(
            "Public Endpoint:",
            publicEndpoint
        );

        console.log(
            "JWT:",
            token
                ? "Available"
                : "Not Available"
        );

        console.log(
            "Authorization:",
            config.headers.Authorization
                ? "Bearer token attached"
                : "Not attached"
        );

        console.log(
            "Headers:",
            config.headers
        );

        console.log(
            "Data:",
            config.data
        );

        console.groupEnd();

        return config;
    },

    (error) => {

        console.error(
            "❌ Request interceptor error:",
            error
        );

        return Promise.reject(
            error
        );
    }
);

/* ======================================================
   RESPONSE INTERCEPTOR
====================================================== */

API.interceptors.response.use(

    (response) => {

        console.groupCollapsed(
            `✅ ${response.status} ${response.config.url}`
        );

        console.log(
            "Response:",
            response.data
        );

        console.groupEnd();

        return response;
    },

    async (error) => {

        /* ==============================================
           SERVER UNREACHABLE / NETWORK ERROR
        ============================================== */

        if (!error.response) {

            console.error(
                "❌ Backend server is unreachable."
            );

            console.error(
                "Request:",
                error.config?.url
            );

            /*
               Do NOT use alert() here.

               Dashboard auto-refresh can make
               multiple requests and cause many
               popup windows.
            */

            return Promise.reject(
                error
            );
        }

        /* ==============================================
           RESPONSE INFORMATION
        ============================================== */

        const status =
            error.response.status;

        const data =
            error.response.data;

        const requestUrl =
            error.config?.url || "";

        const publicEndpoint =
            isPublicEndpoint(
                requestUrl
            );

        /* ==============================================
           ERROR LOGGING
        ============================================== */

        console.groupCollapsed(
            `❌ ${status} ${requestUrl}`
        );

        console.log(
            "Status:",
            status
        );

        console.log(
            "Data:",
            data
        );

        console.log(
            "Public Endpoint:",
            publicEndpoint
        );

        console.groupEnd();

        /* ==============================================
           400 BAD REQUEST
        ============================================== */

        if (status === 400) {

            console.error(
                "❌ Bad Request"
            );

            return Promise.reject(
                error
            );
        }

        /* ==============================================
           401 UNAUTHORIZED
        ============================================== */

        if (status === 401) {

            console.error(
                "❌ Unauthorized - JWT is missing, invalid or expired."
            );

            /*
               IMPORTANT:

               Do NOT remove the token for a public
               login request.

               Example:

               POST /auth/login
               wrong password
               -> 401

               The user should receive the login
               error instead of being redirected
               unnecessarily.
            */

            if (!publicEndpoint) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "currentUser"
                );

                /*
                   Redirect only if the user is
                   currently somewhere other than
                   the login page.
                */

                if (
                    window.location.pathname !==
                    "/login"
                ) {

                    window.location.href =
                        "/login";
                }

            }

            return Promise.reject(
                error
            );
        }

        /* ==============================================
           403 FORBIDDEN
        ============================================== */

        if (status === 403) {

            console.error(
                "❌ Forbidden - insufficient permissions."
            );

            return Promise.reject(
                error
            );
        }

        /* ==============================================
           404 NOT FOUND
        ============================================== */

        if (status === 404) {

            console.error(
                "❌ Endpoint Not Found:",
                requestUrl
            );

            return Promise.reject(
                error
            );
        }

        /* ==============================================
           409 CONFLICT
        ============================================== */

        if (status === 409) {

            console.error(
                "❌ Duplicate / Conflict:"
            );

            return Promise.reject(
                error
            );
        }

        /* ==============================================
           500 SERVER ERROR
        ============================================== */

        if (status === 500) {

            console.error(
                "❌ Internal Server Error"
            );

            console.error(
                "Backend response:",
                data
            );

            return Promise.reject(
                error
            );
        }

        /* ==============================================
           OTHER ERRORS
        ============================================== */

        console.error(
            "❌ Unexpected HTTP Error:",
            status
        );

        return Promise.reject(
            error
        );
    }
);

/* ======================================================
   EXPORT
====================================================== */

export default API;
