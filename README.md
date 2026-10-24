# Khayre Ali's Portfolio

Personal website built with React and Firebase.

The homepage title, search description, structured data, and initial biography
come from `src/data/profile.json`. `npm run build` and `npm start` regenerate
`public/index.html` so the biography is readable before JavaScript or Firebase
loads. Firebase can still refresh the visible biography; update the profile
snapshot as well when changing content that should appear in the initial HTML.

The favicon and app icons use the portrait in `public/`. Google chooses its own
search snippets and refreshes the icon after recrawling the site.
