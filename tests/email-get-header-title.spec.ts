import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
const Mailosaur = require("mailosaur");
const { JSDOM } = require("jsdom");

const apiKey = "BCIXcGwp8iWcU52jVmLBX0Ac5GCJvw8j";
const mailosaur = new Mailosaur(apiKey);
const serverId = "2fewu8m9";

test("Get header title using JSDOM", async ({ page }) => {
  await page.goto("https://example.mailosaur.com/otp");

  const username =
    "hov-" +
    faker.internet
      .userName()
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
  const emailServer = "2fewu8m9.mailosaur.net";
  const email = `${username}@${emailServer}`;

  await page.locator("#email").type(email);
  await page.locator('button[type="submit"]').click();

  const emailContent = await mailosaur.messages.get(serverId, {
    sentTo: email,
  });

  const dom = new JSDOM(emailContent.html.body);

  const headingElement = dom.window.document.querySelector("h1");
  let headingText;

  if (headingElement !== null) {
    headingText = headingElement.textContent;
  } else {
    console.log("Heading element not found");
  }

  console.log(headingText);
});
