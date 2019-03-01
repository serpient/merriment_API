import { expect } from "chai";
import * as userApi from "./api";

describe("users", () => {
  it("user is user", () => {
    expect("user").to.eql("user");
  });
});

describe("users", () => {
  describe("user(id: String!): User", () => {
    it("returns a user when user can be found", async () => {
      const expectedResult = {
        data: {
          user: {
            id: "1",
            username: "rwieruch",
            email: "hello@robin.com",
            role: "ADMIN"
          }
        }
      };

      const result = await userApi.user({ id: "1" });

      expect(result.data).to.eql(expectedResult);
      /*
      You make a GraphQL API request with axios, expecting a query/mutation result from the API. 
      Behind the scenes, data is read or written from or to the database. The 
      business logic such as authentication, authorization, and pagination 
      works in between. A request goes through the whole GraphQL server stack 
      from API to database. 
      */
    });

    it("returns null when user cannot be found", async () => {
      const expectedResult = {
        data: {
          user: null
        }
      };

      const result = await userApi.user({ id: "42" });

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe("deleteUser(id: String!): Boolean!", () => {
    it("returns an error because only admins can delete a user", async () => {
      const {
        data: {
          data: {
            signIn: { token }
          }
        }
      } = await userApi.signIn({
        login: "ddavids",
        password: "ddavids"
      });
      console.log(token);
      const {
        data: { errors }
      } = await userApi.deleteUser({ id: "1" }, token);

      expect(errors[0].message).to.eql("Not authorized as admin.");
    });
  });
});
