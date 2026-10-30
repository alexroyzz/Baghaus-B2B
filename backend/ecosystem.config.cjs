module.exports = {
  apps: [
    {
      name: "baghaus-api",
      script: "./server.js",
      instances: process.env.PM2_INSTANCES || 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART || "500M",
      kill_timeout: Number(process.env.SHUTDOWN_TIMEOUT_MS) || 10_000,
      listen_timeout: 15_000,
      exp_backoff_restart_delay: 1_000,
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
