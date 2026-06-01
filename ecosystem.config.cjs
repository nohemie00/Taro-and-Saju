module.exports = {
  apps: [
    {
      name: 'osaekwoon-api',
      cwd: '/home/user/webapp/apps/api',
      script: 'npx',
      args: 'wrangler dev --port 8787 --ip 0.0.0.0',
      env: {
        NODE_ENV: 'development',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
    {
      name: 'osaekwoon-web',
      cwd: '/home/user/webapp/apps/web',
      script: 'npx',
      args: 'vite --host 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
  ],
};
