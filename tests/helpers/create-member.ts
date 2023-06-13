import request from "supertest";

export async function createMember(
  params: {
    username: string;
    email: string;
    number: string;
    firstName: string;
    lastName: string;
  },
  accessToken: string
) {
  const response = await request("https://api-admin-staging.aonewallet.com")
    .post("/graphql")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      query: `mutation CreateMember($input: CreateMemberInput!) {
        createMember(input: $input)
      }`,
      variables: {
        input: {
          username: params.username,
          password: "password",
          email: params.email,
          memberLevel: "mlv_514bee1c7a7f4950ab5970e11911d16e",
          dateOfBirth: "1999-08-05",
          gender: "FEMALE",
          mobileNumber: params.number,
          status: "ENABLED",
          firstName: params.firstName,
          lastName: params.lastName,
          countryCode: "+7",
          depositLimitFrequency: "MONTHLY",
          memberLoyaltyLevels: ["mll_95aabc67abb945f497ff15e4fde33d3e"],
          address: {
            country: "Albania",
            premise: "Poliçan",
            street: "Rruga Bogovës",
            postCode: "5403",
          },
          title: "MS",
          depositLimit: 0,
        },
      },
    });

  if (response.body.errors) {
    throw new Error(response.body.errors[0].message);
  }
  const memberID = response.body.data.createMember;

  return { memberID };
}
