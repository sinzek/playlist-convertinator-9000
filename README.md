# Playlist Convertinator 9000

#### This website will convert Spotify playlists to YouTube Music playlists and vice versa

> Eventually, I plan to add support for other music streaming platforms in the future

## Frontend:

- React (HTML, CSS, Javascript, Node.js)
- Vite
- SWC
- Tailwindcss
- [daisyUI](https://daisyui.com)
- react-router-dom
- axios

## Backend:
- Express.js
- MongoDB (for development purposes, will switch to something else in the future)
- Spotify API
- [muse](https://github.com/vixalien/muse) (YT Music API workaround)
- etc.

`npm run dev` for frontend development server
`node server.js` for backend server

### TODO:
- [ ] Redo YT Music API OAuth access since Google is utilizing cookies now?? Reference: https://github.com/sigma67/ytmusicapi/discussions/682
- [ ] Refresh YT Music and Spotify tokens on login & add checks to determine whether refresh tokens have expired
- [ ] Set up playlist CRUD routes for Spotify & YT Music
- [ ] Finish build out of profile section (profile settings, account deletion)
- [ ] Elegantly display user-created playlists on dashboard page & allow for deletion
- [ ] Build out convert page
- [ ] Set up conversion process (choose playlist, select whether to add to existing or create new playlist for insertion, search for each song, store them in DB, prompt user if certain song not found, choose sorting order, etc.)
- [ ] Completion screen with link to user's playlist (if set to public)

### MAYBE TODO?
- [ ] Allow for sharing playlist with friends (link with expiry date?)
- [ ] Show # of created playlists on homepage
- [ ] Show latest created playlist and by what username on homepage?
