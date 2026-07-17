# Twimbol — Deployment Guide

This document is the single source of truth for how Twimbol is built and deployed.
Give this file to Claude Code / any developer on a new machine — it explains exactly
where everything lives and how to ship a change.

## 1. Architecture at a glance

```
twimbol.com  (Vercel, Vite/React frontend)
      │
      ▼  HTTPS, VITE_API_BASE_URL
api.twimbol.com  (AWS EC2, Django/DRF backend, Docker Compose: nginx + gunicorn + django)
      │
      ▼  private, port 5432 only from app server
AWS RDS PostgreSQL (twimbol-prod-db)
```

| Piece            | Where                                                | Repo                                                   |
|-------------------|-------------------------------------------------------|---------------------------------------------------------|
| Frontend           | Vercel, domain `twimbol.com`                          | `github.com/asifmollik12/twimbol-web` (public/private, this repo) |
| Backend            | AWS EC2 (`ap-southeast-1`), domain `api.twimbol.com`   | `github.com/asifmollik12/twimbol-backend` (private)     |
| Database           | AWS RDS PostgreSQL `twimbol-prod-db`                   | n/a (managed)                                            |
| Profile media       | AWS S3 `twimbol-profile-media-prod`                    | n/a (managed)                                            |

---

## 2. Frontend deployment (Vercel)

### One-time setup on a new laptop
```bash
git clone https://github.com/asifmollik12/twimbol-web.git
cd twimbol-web
npm install
npm i -g vercel@latest
vercel login              # log in with the account tied to eyamin@cmddesign.co
vercel link                # select org "team_AtAat5pXG8jWyzRPxIAtnqPE", project "twimbol-web"
```
Project identity is already saved in the repo at `.vercel/project.json`:
- projectId: `prj_Th7EmNqSR43RrQb2iXDDE80gf23B`
- orgId: `team_AtAat5pXG8jWyzRPxIAtnqPE`

### Local development
```bash
npm run dev
```
Local dev talks to the production backend (`VITE_API_BASE_URL=https://api.twimbol.com`)
unless overridden in a local `.env.local`.

### Deploying a change
**Right now, deploys are manual.** Pushing to GitHub alone does NOT deploy — you must
run the Vercel CLI:
```bash
git add -A && git commit -m "..."
git push origin main
vercel --prod --yes
```

**Recommended: switch to automatic git-based deploys.** Do this once, from the Vercel
dashboard (Project → Settings → Git → Connect Git Repository → select
`asifmollik12/twimbol-web`). After that, *any* laptop only needs to `git push origin main`
— Vercel builds and deploys automatically, no CLI or Vercel login required on that machine.
This is the setup to use for "change on any laptop → auto-deploy."

### Key facts
- Framework: Vite, Node 24.x
- Production domain: `twimbol.com`
- Env var `VITE_API_BASE_URL` = `https://api.twimbol.com` — already set in Vercel's
  Production environment. Change it via `vercel env rm/add VITE_API_BASE_URL production`
  only if the backend URL ever changes.

---

## 3. Backend deployment (AWS)

### Repo
`git clone https://github.com/asifmollik12/twimbol-backend.git` (private repo, restored
from the S3 deploy artifact and pushed to GitHub so it's no longer only on one machine).

Django apps: `accounts/` (auth, profile, roles), `posts/`, `content/` (reels/videos),
`creator_apps/`. Runs as 3 containers via `docker-compose.yml`: `web` (gunicorn/Django),
`nginx`, `certbot`.

### AWS resources (region: `ap-southeast-1`)
| Resource | ID / Name |
|---|---|
| EC2 instance | `i-06a1137c99dd00012`, Elastic IP `18.139.65.119` |
| RDS instance | `twimbol-prod-db` (`twimbol-prod-db.cv2g6mc6yjqv.ap-southeast-1.rds.amazonaws.com`) |
| Security groups | `twimbol-app-sg` (`sg-02cf6e656b7302a00`), `twimbol-rds-sg` (`sg-078a1262b4225d076`) |
| S3 buckets | `twimbol-deploy-artifacts`, `twimbol-profile-media-prod` |
| Secrets | AWS SSM Parameter Store under `/twimbol/prod/*` |
| IAM deploy user | `twimbol-deploy` (scoped, non-admin) |

**No SSH is open on the server (port 22 is closed).** All server access goes through
AWS Systems Manager (SSM) Session Manager / Run Command using the `twimbol-deploy` IAM
credentials — this is intentional for security.

### One-time setup on a new laptop
```bash
brew install awscli session-manager-plugin      # or your OS equivalent
aws configure --profile twimbol
# Access Key ID / Secret Access Key: get these from your password manager
# (they belong to IAM user "twimbol-deploy" — never share/commit them)
# Default region: ap-southeast-1
```

### Deploying a backend change
1. Edit code in the `twimbol-backend` repo, commit, push to GitHub as usual.
2. Package and ship it to the server:
   ```bash
   COPYFILE_DISABLE=1 tar czf twimbol-backend.tar.gz --exclude='.git' .
   aws s3 cp twimbol-backend.tar.gz s3://twimbol-deploy-artifacts/twimbol-backend.tar.gz \
     --profile twimbol --region ap-southeast-1
   ```
3. Tell the server to pull and rebuild, via SSM (no SSH needed):
   ```bash
   aws ssm send-command \
     --instance-ids i-06a1137c99dd00012 \
     --document-name "AWS-RunShellScript" \
     --parameters 'commands=[
       "cd /home/ec2-user/app",
       "aws s3 cp s3://twimbol-deploy-artifacts/twimbol-backend.tar.gz .",
       "tar xzf twimbol-backend.tar.gz",
       "docker-compose up -d --build web",
       "docker-compose exec -T web python manage.py migrate --noinput"
     ]' \
     --profile twimbol --region ap-southeast-1
   ```
4. Verify:
   ```bash
   curl -I https://api.twimbol.com/admin/
   ```

### Admin panel
`https://api.twimbol.com/admin/` — full CRUD over users, roles (via Groups:
`visitor`/`creator`/`admin`), posts, reels/videos, creator applications.
Username: `admin`. Password: was shared once in chat — store it in a password
manager now if you haven't; it is **not** written in this file on purpose.
To reset it, run `docker-compose exec web python manage.py changepassword admin`
via SSM Run Command.

---

## 4. Secrets — where they actually live

**Never put real secrets in this file or commit them to either repo.**

| Secret | Location |
|---|---|
| `twimbol-deploy` AWS access key | Your password manager; put into local `~/.aws/credentials` only |
| Django `SECRET_KEY`, DB password | AWS SSM Parameter Store, `/twimbol/prod/*` |
| Admin panel password | Your password manager |
| Vercel account login | `eyamin@cmddesign.co` |

To read a secret from SSM (needs the `twimbol` AWS profile):
```bash
aws ssm get-parameter --name /twimbol/prod/DB_PASSWORD --with-decryption \
  --profile twimbol --region ap-southeast-1 --query Parameter.Value --output text
```

---

## 5. Known follow-ups
- `.git/config` in `twimbol-web` previously had a GitHub token embedded in the remote
  URL — rotate that token and re-set the remote to `https://github.com/asifmollik12/twimbol-web.git`
  (credential-manager auth) or SSH.
- Vercel is not yet connected to GitHub for auto-deploy (see §2) — recommended next step.
- MFA on the AWS root account and the `twimbol-deploy` IAM user should be finished if
  not already done.
