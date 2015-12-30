# Load Monitor

## Package Dependencies
Requires an installation of Node.js
(see https://nodejs.org/en/)

## Installation
    npm install
May need root priviliges to install

## To Start Server And View Page
    npm start
After server is started, open your browser to "localhost:3000"

## To Test
TODO: mock out os module to write test.
Since no automated tests written at this point, run server and keep screen open.
To increase machine load to trigger warning, opening multiple tabs for different web pages in Chrome has done the trick for me.

## Possible Design Improvements
If socket connection is dropped, would cause a gap in graph. If page is reloaded by user the graph is redrawn from scratch. To avoid these behaviors, want to cache a history of the range of data needed for plotting in the server, when it is passed to front end, update and transition the d3 line according to what may be missing.
