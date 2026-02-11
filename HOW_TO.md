## How to Commit and Push Changes to GitHub

These steps assume you are in this project folder in a terminal:

```bash
cd /Users/yueyeung/dev/capstone-sandbox
```

### 1. See What Changed

```bash
git status
```

### 2. Stage Your Changes

- To stage a specific file (example: `PROJECT_REQUIREMENTS.md`):

```bash
git add PROJECT_REQUIREMENTS.md
```

- To stage everything you changed:

```bash
git add .
```

### 3. Commit with a Message

Use a short, clear message about what you changed:

```bash
git commit -m "Describe what you changed"
```

If Git complains about your name/email, set them once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Then run the `git commit` command again.

### 4. Push to GitHub

Make sure the remote is set (already done for this project):

```bash
git remote -v
```

Push your commits to the `main` branch on GitHub:

```bash
git push origin main
```

If Git asks for a username/password:
- Use your **GitHub username** and a **Personal Access Token (PAT)** as the password, or
- Use Cursor’s built-in Source Control UI to push (Git icon in the sidebar → Push/Sync).

### 5. Confirm on GitHub

1. Go to the repo page on GitHub.  
2. Check the **Commits** tab or the file view to see your latest changes.

