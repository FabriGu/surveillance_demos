# Client-side Pupil Tracking

Pupil tracking is not commonly done in the browser or even in phone apps due to the need to ask user permission for camera access. However it is widely done in places like airports and border crossings and represents a "frontier" in adtech surveillance as always-on camera VR and XR devices become more commonplace (to what degree of commonplaceness is of course to be seen).

This demo uses [WebGazer.js](https://webgazer.cs.brown.edu/), an open source tool for pupil tracking in client-side javascript made by researchers at Brown. In it webgazer's pupil tracking is implemented using a p5 canvas. This repo has all of the client side code necessary to run the demo using a tool such as [browser-sync](https://browsersync.io/). All you would need to do is install browser-sync via `npm install -g browser-sync` and then run `browser-sync -f . -s .`

The demo is also available via the p5 web editor [here](https://editor.p5js.org/theodora/sketches/3UtD2Mc5R)
