/* global TrelloPowerUp */

import request from "superagent";

import GRAY_ICON from "/images/icon-gray.svg";

const TRELLO_API_KEY = "f29cdcb85b50ce35ec98517e1508e5cc";

const addCredentials = async (request, token) =>
  `${request}&key=${TRELLO_API_KEY}&token=${token}`;

const cardButtonCallback = async t => {
  const lists = await t.lists("all");
  const templates = lists.filter(({ name }) => name === "Templates")[0].cards;

  const { id: cardId } = await t.card("id");

  const items = templates.map(template => ({
    text: template.name,
    callback: async t => {
      const token = await t.get("member", "private", "token");
      const url = await addCredentials(
        `https://api.trello.com/1/cards/${cardId}?desc=${encodeURIComponent(
          template.desc
        )}`,
        token
      );
      await request.put(url);
      t.closePopup();
    }
  }));

  return t.popup({
    title: "Card Templates",
    items: items,
    search: {
      count: 5,
      placeholder: "Search Card Template",
      empty: "No template found"
    }
  });
};

TrelloPowerUp.initialize({
  "card-buttons": function(t, options) {
    return [
      {
        icon: `.${GRAY_ICON}`,
        text: "Open Popup",
        callback: cardButtonCallback
      }
    ];
  },
  "show-settings": function(t, options) {
    return t.popup({
      title: "Settings",
      url: settingsPage,
      height: 184
    });
  },
  "authorization-status": function(t, options) {
    return t.get("member", "private", "token").then(function(token) {
      if (token) {
        return { authorized: true };
      }
      return { authorized: false };
    });
  },
  "show-authorization": function(t, options) {
    if (TRELLO_API_KEY) {
      return t.popup({
        title: "Auth Popup",
        args: { apiKey: TRELLO_API_KEY },
        url: "./authorize.html",
        height: 140
      });
    } else {
      console.log("🙈 Looks like you need to add your API key to the project!");
    }
  }
});

console.log("Loaded by: " + document.referrer);
