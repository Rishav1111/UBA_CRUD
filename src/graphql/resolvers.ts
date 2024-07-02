import { updateUser } from "../controllers/user";
import { User } from "../model/userModel";
import userData from "../userData.json";

let users: User[] = userData as User[];

export const resolvers = {
  Query: {
    users: () => users,
    user: (_: any, args: { id: any }) => {
      const user = users.find((user) => user.id === Number(args.id));
      return user;
    },
    userSort: (
      _: any,
      {
        sortField = "fullname",
        sortOrder = "asc",
        offset = 0,
        limit = users.length,
      }: {
        sortField?: keyof User;
        sortOrder?: "asc" | "desc";
        offset?: number;
        limit?: number;
      }
    ) => {
      // Sort the users
      const sortedUsers = users.slice().sort((a, b) => {
        let fieldA = a[sortField];
        let fieldB = b[sortField];
        if (typeof fieldA === "string" && typeof fieldB === "string") {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }
        if (sortOrder === "asc") {
          return fieldA > fieldB ? 1 : -1;
        } else {
          return fieldA < fieldB ? 1 : -1;
        }
      });

      // Apply pagination using offset and limit
      return sortedUsers.slice(offset, offset + limit);
    },
  },
  Mutation: {
    deleteUser(_: any, args: { id: any }) {
      const user = users.filter((user) => user.id !== Number(args.id));
      return user;
    },

    addUser(_: any, args: { user: User }) {
      let newUser = {
        ...args.user,
        id: users.length + 1,
      };
      users.push(newUser);
      return users;
    },
    updateUser(_: any, args: { id: any; edits: User }) {
      const user = users.find((user) => user.id === Number(args.id));
      if (!user) {
        throw new Error("User not found");
      }
      const index = users.indexOf(user);
      users[index] = { ...user, ...args.edits };
      return users[index];
    },
  },
};
