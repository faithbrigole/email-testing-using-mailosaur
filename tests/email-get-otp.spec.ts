import { test } from "@playwright/test";
import { faker } from "@faker-js/faker";
const Mailosaur = require("mailosaur");
const { JSDOM } = require("jsdom");

const apiKey = "BCIXcGwp8iWcU52jVmLBX0Ac5GCJvw8j";
const mailosaur = new Mailosaur(apiKey);
const serverId = "2fewu8m9";

test("Email testing - get one time passcode using HTML", async ({ page }) => {
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

  const regEx: RegExp = new RegExp("([0-9]{6})");
  const getCode: RegExpExecArray | null = regEx.exec(emailContent.text.body);

  if (getCode !== null) {
    console.log("Code: " + getCode[0]);
  }
});

test("Get the code using JSDOM", async ({ page }) => {
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

  const dom = new JSDOM(emailContent.text.body);

  const el = dom.window.document.querySelectorAll(".content-block");
  let verificationCode;

  if (el !== null) {
    const getCode = el[2];
    verificationCode = getCode.textContent;
  } else {
    console.log("Element not found");
  }

  console.log(verificationCode);
});
