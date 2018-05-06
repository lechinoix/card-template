/* global TrelloPowerUp */

import request from "superagent";

import GRAY_ICON from "/images/icon-gray.svg";

const TRELLO_API_KEY = "f29cdcb85b50ce35ec98517e1508e5cc";
const TRELLO_API_BASE_URL = "https://api.trello.com/1";

const generateApiCredentials = token => ({
  key: TRELLO_API_KEY,
  token
});

const changeCardDescription = async (cardId, desc, token) =>
  request
    .put(`${TRELLO_API_BASE_URL}/cards/${cardId}`)
    .query({ desc })
    .query(generateApiCredentials(token));

const addTemplateChecklists = async (cardId, templateId, token) => {
  const { body: templateChecklists } = await request
    .get(`${TRELLO_API_BASE_URL}/cards/${templateId}/checklists`)
    .query(generateApiCredentials(token));
  return Promise.all(
    templateChecklists.map(({ id }) =>
      request
        .post(`${TRELLO_API_BASE_URL}/cards/${cardId}/checklists`)
        .query({ idChecklistSource: id })
        .query(generateApiCredentials(token))
    )
  );
};

const cardButtonCallback = async t => {
  const lists = await t.lists("all");
  const templates = lists.filter(({ name }) => name === "Templates")[0].cards;

  const { id: cardId } = await t.card("id");

  const items = templates.map(template => ({
    text: template.name,
    callback: async t => {
      const token = await t.get("member", "private", "token");
      await changeCardDescription(cardId, template.desc, token);
      await addTemplateChecklists(cardId, template.id, token);
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
        icon: `.${GRAY_ICON}`, // Absolute path takes Trello base URL
        text: "Templates",
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
