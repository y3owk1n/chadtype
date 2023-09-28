import million from "million/compiler";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

const millionConfig = {
    // auto: true,
    // if you're using RSC:
    auto: { rsc: true },
};

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    experimental: {
        serverActions: true,
        esmExternals: "loose",
    },

    /**
     * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
     * out.
     *
     * @see https://github.com/vercel/next.js/issues/41980
     */
    // i18n: {
    //     locales: ["en"],
    //     defaultLocale: "en",
    // },
};
export default million.next(config, millionConfig);
