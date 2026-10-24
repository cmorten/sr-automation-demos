# BBC Homepage

This demo navigates the BBC Homepage (https://www.bbc.co.uk) header to navigate to BBC Sounds using VoiceOver on Playwright WebKit.

There are two tests:

1. Navigating only with the next command
2. Navigating with the next command to the "More menu" and then with the next link command

To run locally:

```sh
# Set up your machine for screen reader automation
npx @guidepup/setup

# Install project dependencies
npm ci

# Install Playwright webkit browser
npx playwright install webkit

# Install Guidepup screen reader assets
npx @guidepup/setup install

# Run the Playwright + Guidepup based screen reader test
npm run test
```
