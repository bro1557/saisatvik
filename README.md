# saisatvik.com

This is my personal website. Mostly cars, a few games I built with Claude, and a running list of what I'm up to. I wanted it to feel like me and load fast, 
so it's plain HTML, CSS and JavaScript with no framework. For a site this size, a framework would only add weight.

It's live at https://saisatvik.com.

## What's on it

- **Home.** A quote, a hanging lamp, and a trick. Switch the lamp off and the page goes dark for Night Drive: a small Model Y drives down the left edge as you scroll, and its headlights light up whatever's ahead. It's the showiest thing on the site.
- **Lookup Gadget.** Type a car, get a rough price new and a rough price now. It covers most US enthusiast cars, but not niche euros, because I'm only human. Treat the numbers as a ballpark.
- **Compare.** Pick two cars from the Lookup Gadget data and compare their estimated new prices and typical used ranges side by side.
- **Garage.** One I have (the Model Y) and two I want (a Ford F-150 Raptor and a Koenigsegg Regera).
- **Games.** Gavel and Grease, Mahishmati Defense and Hit 21. They're hosted on Netlify, not in this repo, so the site only links out to them.
- **About.** A timeline of how I got obsessed with cars and tech, from a red car in 2013 to talking my dad into a Tesla in 2021 to building websites now.
- **Now.** What I'm up to lately, newest first.

## How it's put together

```
index.html      home page
about.html      about page
now.html        now page
compare.html    side-by-side car price comparison
style.css       styles for every page
script.js       the lamp, Night Drive, Lookup Gadget, comparison, and keyboard shortcuts
images/         every image on the site
favicon.svg     favicon and link preview files
robots.txt      rules for search engines
sitemap.xml     page list for search engines
```

There's no build step. What you see in the folder is what gets served.

## Running it locally

1. Clone the repo and open the folder in VS Code.
2. Install the Live Server extension if you don't have it.
3. Right click `index.html` and open with your previewer.
4. Edit and save. The browser refreshes on its own.

I always test here first. Pushing a broken page to a live site is a bad way to find out you missed a closing tag.

## Changing things

- **New Now entry:** add it to the top of the timeline in `now.html`.
- **New car in the Garage:** drop the photo in `images/`, then copy one of the existing blocks in `index.html` and swap in the new car.
- **New game:** add a screenshot to `images/` and copy an existing card in the Games section.

## Deploying

The site runs on Cloudflare Workers & Pages, connected to this GitHub repo. Push, give it a minute or two, and the new version is live. DNS lives on Cloudflare too. The domain is still registered at GoDaddy, and I plan to move it over eventually.

One quirk to remember: after a push, saisatvik.com once vanished from the custom domains list. If that happens again, re-add it in the project with Add Domain and leave the subdomain box empty.

Want to say hi or ask about a car? y.saisatvik@gmail.com.
