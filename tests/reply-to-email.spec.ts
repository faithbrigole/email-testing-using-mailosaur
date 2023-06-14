import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
const Mailosaur = require("mailosaur");

const apiKey = "BCIXcGwp8iWcU52jVmLBX0Ac5GCJvw8j";
const emailServer = "2fewu8m9.mailosaur.net";
const mailosaur = new Mailosaur(apiKey);
const serverId = "2fewu8m9";

test("Reply to an email", async ({ page }) => {
  await page.goto("https://example.mailosaur.com/password-reset");

  const username = faker.internet.userName().toLowerCase();
  const email = `${username}@${emailServer}`;
  await page.locator("#email").type(email);
  await page.locator('button[type="submit"]').click();

  // search for email
  const emailContent = await mailosaur.messages.search(serverId, {
    sentTo: email,
  });

  console.log(emailContent.items[0].id);
  const getMessageID = emailContent.items[0].id;

  // reply to an email
  // NOTE: Before you can reply to an email you need to register the email address first
  await mailosaur.messages.reply(`${getMessageID}`, {
    html: "<p>Test reply to an email</p>",
  });
});
