# Deployment

This workshop stack is intended to run on `http://192.168.6.101` with Docker, an Express backend, and PostgreSQL.

## Services

- `frontend`: Docusaurus static build served by Nginx
- `backend`: Express + TypeScript API on internal port `3001`
- `postgres`: PostgreSQL with a named Docker volume for persistent data

Postgres data is stored in the named Docker volume `postgres_data`.

Do not run `docker compose down -v` unless you intentionally want to delete the database volume.

## First-time server setup

1. SSH into the host:

```bash
ssh root@192.168.6.101
```

2. Verify Docker is installed:

```bash
docker --version
docker compose version
```

3. Create deployment directories:

```bash
mkdir -p /opt/cellular-automata-workshop
mkdir -p /opt/cellular-automata-workshop/backups
```

4. Create the environment file outside git:

```bash
nano /opt/cellular-automata-workshop/.env
```

Use values based on `.env.example`. Do not commit real passwords or secrets.

The environment file should include at least:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `BACKEND_PORT`
- `ADMIN_PASSWORD`
- `SITE_URL`
- `BASE_URL`

5. Clone or update the repository under the deployment directory and enter it.

6. Build and start the stack:

```bash
docker compose --env-file /opt/cellular-automata-workshop/.env up -d --build
```

## Verification

Run these checks on the server:

```bash
curl http://localhost/api/health
curl http://192.168.6.101/api/health
```

Open the site in a browser:

- [http://192.168.6.101](http://192.168.6.101)
- [http://192.168.6.101/submit](http://192.168.6.101/submit)
- [http://192.168.6.101/start-state-gallery](http://192.168.6.101/start-state-gallery)
- [http://192.168.6.101/project-gallery](http://192.168.6.101/project-gallery)
- [http://192.168.6.101/admin](http://192.168.6.101/admin)

## Moderation

- `/admin` is password-protected by the `ADMIN_PASSWORD` environment variable.
- The admin dashboard can hide or restore public submissions without deleting them from the database.
- Public gallery endpoints never return student email addresses.

## Submission protection

- Submission POST routes are rate-limited in the backend to reduce spam bursts.
- Start-state and project entries only appear publicly when students grant showcase permission and the admin has not hidden them.

## Backups

Example manual backup command:

```bash
docker compose exec postgres pg_dump -U ca_workshop ca_workshop > /opt/cellular-automata-workshop/backups/ca_workshop_$(date +%F_%H-%M).sql
```

Scripted backup and restore helpers are included:

```bash
./scripts/backup-db.sh
./scripts/restore-db.sh /opt/cellular-automata-workshop/backups/your_backup.sql
```

## GitHub self-hosted runner

1. In GitHub go to:
   `Repo -> Settings -> Actions -> Runners -> New self-hosted runner`
2. Choose Linux x64.
3. Copy the exact commands GitHub provides.
4. On the server:

```bash
ssh root@192.168.6.101
adduser github-runner
usermod -aG docker github-runner
mkdir -p /opt/actions-runner
chown -R github-runner:github-runner /opt/actions-runner
```

5. Install the runner under `/opt/actions-runner`.
6. Configure it with labels:

- `self-hosted`
- `linux`
- `docker`
- `ca-workshop`

7. Install and start the runner service:

```bash
sudo ./svc.sh install github-runner
sudo ./svc.sh start
```

8. Confirm the runner appears online in GitHub.

Do not commit the GitHub runner token. Do not put SSH credentials or database passwords in the repository.
