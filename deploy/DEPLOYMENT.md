# Deployment guide (cPanel)

## Structure on the server
```
/home/USER/
  config/ezeefin.php          <- real credentials (copy of api/config.sample.php, edited)
  storage/uploads/            <- customer documents (outside web root)
  public_html/
    index.html + assets/      <- contents of app/dist/ (after `npm run build`)
    .htaccess                 <- from deploy/htaccess-root.txt
    api/                      <- the app/api/ folder (excluding sql/ in production)
      .htaccess               <- from deploy/htaccess-api.txt
```

## Steps
1. `npm install && npm run build` locally → upload `dist/*` into `public_html/`.
2. Upload `api/` into `public_html/api/`; rename the two htaccess files.
3. cPanel → MySQL: create DB + user (least privilege), run `sql/001_schema.sql`.
   For the demo environment only, also run `sql/002_seed_demo.sql` and replace the
   staff password hashes (`php -r "echo password_hash('yourpass', PASSWORD_DEFAULT);"`).
4. Copy `api/config.sample.php` to `/home/USER/config/ezeefin.php`, set real credentials, set `debug => false`.
5. Enable AutoSSL; verify https redirect; verify `/api/admin/leads` returns 401 when logged out.
6. Set `VITE_DATA_MODE=api` in `.env` and rebuild when switching off demo mode.
7. Schedule cPanel backups (daily DB, weekly full) and download a copy offsite monthly.

## Demo reset
Re-run `002_seed_demo.sql` after `TRUNCATE`-ing the data tables (demo database only —
keep demo and production in separate databases, ideally separate subdomains).
