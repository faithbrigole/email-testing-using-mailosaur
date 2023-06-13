import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
const Mailosaur = require("mailosaur");

const apiKey = "BCIXcGwp8iWcU52jVmLBX0Ac5GCJvw8j";
const mailosaur = new Mailosaur(apiKey);
const serverId = "2fewu8m9";

test("Email testing - get the subject using API", async ({ page }) => {
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

  const result = await mailosaur.messages.search(serverId, {
    sentTo: email,
  });

  const getSubject = result.items[0];
  console.log(getSubject);
  console.log("Email Subject: ", getSubject.subject);
});

test("Email testing - get the subject using message subject", async ({
  page,
}) => {
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

  // search for the email
  const emailContent = await mailosaur.messages.get(serverId, {
    sentTo: email,
  });

  console.log("Email Subject: ", emailContent.subject);
});
