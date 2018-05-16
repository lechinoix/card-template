# Card Template Power-Up

A simple Trello Power-up to use checklists from templates located in the "Templates" scolumn of your board.

## Installation in your Trello board

Make sure you have a Trello team set up for your board and go to:

👉 [https://trello.com/power-ups/admin](https://trello.com/power-ups/admin)

Select the Trello team you want to add the Power-Up to. Note: You need to be an admin of the Trello team to add custom Power-Ups to it.

Create on new, and fill the form using https://lechinoix.github.io/card-template/ as iframe connector.

Then go to your board and power-ups > Custom > _Your custom power-up_ > Activate

Enable API with the option gear and you are good to go!

## Contribute

First you can read the docs:

👉 [https://developers.trello.com/power-ups/intro](https://developers.trello.com/power-ups/intro)

Then run

```
yarn start
```

And change the iframe connector with the provided ngrok address.
Your changes will be available with live-reloading on your board.

**Tip:** You can create a test team with a test board to dev on the plugin

## Deploy new version

Run the following to deploy a new version of the power-up:

```
yarn deploy
```
