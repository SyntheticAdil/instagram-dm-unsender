# instagram-dm-unsender (idmu)

As of 2023 [instagram.com](https://www.instagram.com) does not allow batch unsending of messages which is why this project came to be.

The userscript allow a user to batch unsend DM in a thread on the web version of [instagram.com](https://www.instagram.com) 

⚠️ Only English language is supported as of yet so please set your UI language to English before running the script.

⚠️ [This might not work](#this-might-not-work)


## Use cases

- One possible use case would be people wanting to switch to fediverse and want to "remove" all their messages from Meta's platform.

## What's the difference between deleting and unsending?

Deleting a thread will only delete messages on your end, the other party will still be able to read your messages.

Unsending a thread on the other hand will delete messages on both ends, the other party will no longer be able to read your messages.

## How does it work / How can I use it?

This script is meant to be run on the page that lists the message threads. 

** The UI will only appear once you select a message thread ** :

![UI Preview](preview.png)

From here three buttons are available :

- Unsend all DMs - Start the unsending workflow
- Batch size - Change the number of page to load between unsending
- Load all DMs - Load all your thread messages

The workflow works as follow:
- Create a list of all messages by querying the DOM with an early messages detection strategy (we test the raw outputs of our ``find-messages-strategy`` against parts of the workflow).
  - For each message do the following:

     - ### Show action menu button:
        Dispatch a mouseover for this message so that the three dots button appears.

     - ### Open action menu:
        Click the three dots button to open the message actions.

     - ### Open unsend confirm modal:
        Click the "Unsend" action button, a modal will open with a dialog that asks user to confirm the intent.

     - ### Click "confirm":
        Click the "confirm" button inside the modal.



There is no concurrency, message are unsent one after another by using a queue.

⚠️ Instagram has a rate limits, after a certain of messages you might get blocked from unsending message for a period of time.

## Installing

Install a Userscript manager for your browser :

- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)
- [Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag?hl=en)

Finally, install the userscript from OpenUserJS :

[Install latest stable release](https://github.com/thoughtsunificator/instagram-dm-unsender/releases/latest/download/idmu.user.js)

[Install development (master) version](https://github.com/thoughtsunificator/instagram-dm-unsender/raw/userscript/idmu.user.js)

[Older releases](https://github.com/thoughtsunificator/instagram-dm-unsender/releases)

## Development

I recommend using [Violentmonkey](https://violentmonkey.github.io/) or similar and enable userscript autoreloading as explained in here https://violentmonkey.github.io/posts/how-to-edit-scripts-with-your-favorite-editor/ 

Install dependencies:
- ``npm install``

To both serve and build with autoreloading:
- ``npm start``

> This will also start an HTTP server and allow autoreloading of the userscript as changes are made.

You can also do a one-time build with:
- ``npm run build``

> The script will build to ``dist/idmu.user.js`` by default.

## This might not work

Instagram web app is serving different UIs probably based on the user location. [Yours might not be supported](https://github.com/thoughtsunificator/instagram-dm-unsender/issues/1)

Link to the issue : [https://github.com/thoughtsunificator/instagram-dm-unsender/issues/1](https://github.com/thoughtsunificator/instagram-dm-unsender/issues/1)

## Testing

Use the ``DEBUG=idmu:test`` env to enable debug logs while testing.

Lint files:
- ``npm run eslint``

Run test with ava:
- ``npm test``

Coverage:
- ``npm run c8``

## TODO 

- [ ] i18n, make sure it works for all languages
- [ ] l10n, make sure it works not only for the US version but also for the others.
- [ ] alert system (for scenarios such as rate limits)
