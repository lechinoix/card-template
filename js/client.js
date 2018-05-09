/* global TrelloPowerUp */

import request from "superagent";

import GRAY_ICON from "/images/icon-gray.svg";

const TRELLO_API_KEY = "f29cdcb85b50ce35ec98517e1508e5cc";
const TRELLO_API_BASE_URL = "https://api.trello.com/1";

const generateApiCredentials = token => ({
  key: TRELLO_API_KEY,
  token
});

// const changeCardDescription = (cardId, desc, token) =>
//   request
//     .put(`${TRELLO_API_BASE_URL}/cards/${cardId}`)
//     .query({ desc })
//     .query(generateApiCredentials(token));

const getCardChecklists = (cardId, token) =>
  request
    .get(`${TRELLO_API_BASE_URL}/cards/${cardId}/checklists`)
    .query(generateApiCredentials(token));

const resetCardChecklists = async (cardId, templateId, token) => {
  // Get the checklists of the template and the current card
  const [
    { body: templateChecklists },
    { body: cardChecklists }
  ] = await Promise.all([
    getCardChecklists(templateId, token),
    getCardChecklists(cardId, token)
  ]);

  // Sequentially add template checklists to card (to keep order)
  for (var checklist of templateChecklists.sort((a, b) => a.pos > b.pos)) {
    await request
      .post(`${TRELLO_API_BASE_URL}/cards/${cardId}/checklists`)
      .query({ idChecklistSource: checklist.id })
      .query(generateApiCredentials(token));
  }
};

const cardButtonCallback = async t => {
  const lists = await t.lists("all");
  const templates = lists.filter(({ name }) => name === "Templates")[0].cards;

  const { id: cardId } = await t.card("id");

  const items = templates.map(template => ({
    text: template.name,
    callback: async t => {
      const token = await t.get("member", "private", "token");
      // await changeCardDescription(cardId, template.desc, token);
      await resetCardChecklists(cardId, template.id, token);
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
  "card-buttons": (t, options) => [
    {
      icon: GRAY_ICON,
      text: "Templates",
      callback: cardButtonCallback
    }
  ],
  "show-settings": (t, options) =>
    t.popup({
      title: "Settings",
      url: settingsPage,
      height: 184
    }),
  "authorization-status": async (t, options) => {
    const token = await t.get("member", "private", "token");
    return { authorized: !!token };
  },
  "show-authorization": (t, options) =>
    t.popup({
      title: "Auth Popup",
      args: { apiKey: TRELLO_API_KEY },
      url: "./authorize.html",
      height: 140
    })
});

console.log("Loaded by: " + document.referrer);
