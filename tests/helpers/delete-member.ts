import request from "supertest";

export async function deleteMember(memberID: string, accessToken: string) {
  const response = await request("https://api-admin-staging.aonewallet.com")
    .post("/graphql")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      query: `mutation {
        deleteMember(id: "${memberID}")
      }`,
    });

  if (response.body.errors) {
    throw new Error(response.body.errors[0].message);
  }
}
