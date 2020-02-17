module.exports = {
  apps: [
    {
      name: 'theinstamart-admin',
      script: 'npm run prod',
      args: 'one two',
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy: {
    production: {
      key: '~/.ssh/id_rsa',
      user: 'root',
      host: '78.140.223.110',
      ref: 'origin/master',
      repo: 'git@github.com:AskhatB/niet-mobile.git',
      path: '/var/www/niet-mobile',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
}
