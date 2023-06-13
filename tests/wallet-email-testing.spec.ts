import { Page, chromium, expect, test } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createMember } from "./helpers/create-member";
import * as token from "../localstorage.json";
import { deleteMember } from "./helpers/delete-member";
const { JSDOM } = require("jsdom");

let accessToken: string;
const localStorageItem = token.origins[0].localStorage.find(
  (item) => item.name === "BOaccessToken"
);
if (localStorageItem) {
  accessToken = localStorageItem.value;
}

const Mailosaur = require("mailosaur");
const apiKey = "BCIXcGwp8iWcU52jVmLBX0Ac5GCJvw8j";
const mailosaur = new Mailosaur(apiKey);
const serverId = "2fewu8m9";
const emailServer = "2fewu8m9.mailosaur.net";

test("Verify member can receive email upon clicking Timeout Facility", async ({
  page,
}) => {
  const userName = faker.internet.userName().toLowerCase();
  const email = `${userName}@${emailServer}`;
  const number = faker.phone.number();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const { memberID } = await createMember(
    {
      username: userName,
      email: email,
      number: number,
      firstName: firstName,
      lastName: lastName,
    },
    accessToken
  );

  // login to web-portal
  await page.goto("https://qa-staging.aonewallet.com/login");
  await page.getByPlaceholder("Username").click();
  await page.getByPlaceholder("Username").type(userName);
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").type("password");
  await page.getByRole("button", { name: "Login" }).click();

  // click the timeout facility
  await page.getByTestId("inbox").click();
  await page.locator("li#safer-gaming-popup").click();
  await page.locator("li#timeout-facility-popup").click();
  await page.locator(".timeout-facility-continue-button").click();
  await page.locator("button", { hasText: "Confirm" }).click();

  await expect(
    page.locator("#chakra-toast-manager-top", {
      hasText: "Timeout Facility Period Updated",
    })
  ).toBeVisible();

  // check the email
  const emailContent = await mailosaur.messages.get(serverId, {
    sentTo: email,
  });

  // verify that the user receives the timeout email
  const expectedSubject = "Time Out Facility";
  if (!emailContent.subject.includes(expectedSubject)) {
    throw new Error("Subject is incorrect");
  } else {
    console.log("Subject is correct");
  }

  // delete member
  await deleteMember(memberID, accessToken);
});

test("Verify member can receive email after creating an account", async ({
  page,
}) => {
  const userName = faker.internet.userName().toLowerCase();
  const email = `${userName}@${emailServer}`;
  const number = faker.phone.number();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const { memberID } = await createMember(
    {
      username: userName,
      email: email,
      number: number,
      firstName: firstName,
      lastName: lastName,
    },
    accessToken
  );

  // login to web-portal
  await page.goto("https://qa-staging.aonewallet.com/login");
  await page.getByPlaceholder("Username").click();
  await page.getByPlaceholder("Username").type(userName);
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").type("password");
  await page.getByRole("button", { name: "Login" }).click();

  // check the email
  const emailContent = await mailosaur.messages.get(serverId, {
    sentTo: email,
  });

  // expect the username to be visible (1)
  const emailBody = emailContent.html.body;
  const regex = /Username: (\w+)/;
  const match = emailBody.match(regex);

  if (match && match.length > 1) {
    const username = match[1];
    console.log("Username:", username);
  } else {
    console.log("Username not found in the email.");
  }

  // expect the username to be visible (2)
  const containText = `Username: ${userName}`;
  if (String(emailContent.html.body).includes(containText)) {
    console.log("Contains text");
  } else {
    throw new Error("Does not contain text");
  }

  // expect the subject
  const expectedSubject = "Welcome to Antonio";
  if (!emailContent.subject.includes(expectedSubject)) {
    throw new Error("Subject is incorrect");
  } else {
    console.log("Subject is correct");
  }

  // delete member
  await deleteMember(memberID, accessToken);
});
