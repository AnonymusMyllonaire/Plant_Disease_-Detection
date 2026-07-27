# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Deploying this project on Render and Vercel

This repository contains:

- A Python FastAPI backend in `api.py`
- A Vite/React frontend in `src/`
- A TensorFlow model file `plant_model.h5`

### Render

Render is the recommended host for the Python backend.

1. Create a Render account and connect your Git repository.
2. Add a new web service with the root directory set to this project folder.
3. Set environment to **Python**.
4. Use build command:
   - `bash -lc 'if [ -n "$MODEL_URL" ]; then curl -L -o plant_model.h5 "$MODEL_URL"; fi && pip install -r requirements.txt'`
5. Use start command:
   - `uvicorn api:app --host 0.0.0.0 --port $PORT`
6. Set environment variables:
   - `PYTHONUNBUFFERED=1`
   - `MODEL_URL=https://<your-model-storage>/plant_model.h5`
7. After deployment, note the backend URL and use it in the frontend.

> Note: Render will download `plant_model.h5` during build from `MODEL_URL`.
> Do not commit the model file directly to GitHub unless you use Git LFS.

### Frontend on Vercel

Vercel is a good host for the React frontend.

1. Create a Vercel account and connect the same Git repository.
2. Add the project and set the root directory to this project folder.
3. Use build command:
   - `npm install && npm run build`
4. Set output directory:
   - `dist`
5. Add environment variable:
   - `VITE_API_URL=https://<your-backend>.onrender.com`

> Note: Vercel will serve the frontend, while the Render service hosts the Python prediction API.

## Deploying this project on Render and Vercel

This repository contains:

- A Python FastAPI backend in `api.py`
- A Vite/React frontend in `src/`
- A machine learning model file `plant_model.h5`

### Render

1. Create a Render account and connect your Git repository.
2. Deploy the backend as a web service.
   - Root directory: the project folder containing this `package.json`.
   - Environment: Python
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - Set env var: `PYTHONUNBUFFERED=1`
3. Deploy the frontend as a static site.
   - Root directory: the same project folder.
   - Environment: Node
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Set env var: `VITE_API_URL=https://<your-backend>.onrender.com`

### Vercel

1. Create a Vercel account and connect your Git repository.
2. Set the root directory to this project folder.
3. Set build command: `npm install && npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=https://<your-backend>.onrender.com`

> Note: Vercel is best for deploying the frontend. Use Render for the Python backend service.
