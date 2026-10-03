# MFLIX — Fresh ZIP

## Included
- `index.html` — MFLIX frontend
- `server.js` — Node/Express backend
- `package.json` — dependencies
- `render.yaml` — Render configuration
- `data/movies.json` — local movie metadata
- `uploads/` — uploaded poster/video files

## Run locally
1. Install Node.js 20+.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:10000`.

## Render
Create a new Render Web Service from this folder/repository.
Build command: `npm install`
Start command: `npm start`

IMPORTANT:
This starter backend stores uploaded files on the server filesystem. Render's normal filesystem is not permanent, so for production movie storage you should use Mux (or another persistent object-storage service).

## Mux
The frontend accepts a `playbackUrl` for each movie. To make Mux the production video path, the backend should create a Mux Direct Upload, send the uploaded file to Mux, receive the Mux asset/webhook result, then save the Mux playback URL/ID in the movie record.

Do NOT put Mux API secrets in `index.html`. Keep them in Render Environment Variables.

## API
GET `/api/health`
GET `/api/movies`
POST `/api/movies` multipart form:
- title
- description
- category
- year
- poster
- video

## Frontend API URL
By default the frontend calls the same server. If the frontend is hosted separately, open the browser console and set:
`localStorage.setItem("MFLIX_API","https://YOUR-RENDER-SERVICE.onrender.com")`
then reload.

## Admin note
This ZIP is a working baseline. The upload endpoint is intentionally not presented as a secure multi-admin system. Before public launch, add authentication/authorization and persistent storage.
