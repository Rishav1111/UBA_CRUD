import { AppDataSource } from "../db/data_source";
import { User } from "../entity/User";

// Initialize the User repository
const userRepository = AppDataSource.getRepository(User);

export const resolvers = {
  Query: {
    users: async () => {
      return await userRepository.find();
    },
    user: async (_: any, args: { id: number }) => {
      const user = await userRepository.findOneBy({ id: args.id });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    },
    userSort: async (
      _: any,
      {
        sortField = "fullname",
        sortOrder = "asc",
        offset = 0,
        limit = 10,
      }: {
        sortField?: keyof User;
        sortOrder?: "asc" | "desc";
        offset?: number;
        limit?: number;
      }
    ) => {
      const order = sortOrder.toUpperCase() as "ASC" | "DESC";
      const users = await userRepository.find({
        order: {
          [sortField]: order,
        },
        skip: offset,
        take: limit,
      });
      return users;
    },
  },
  Mutation: {
    addUser: async (_: any, args: { user: Partial<User> }) => {
      const newUser = userRepository.create(args.user);
      await userRepository.save(newUser);
      return newUser;
    },
    updateUser: async (_: any, args: { id: number; edits: Partial<User> }) => {
      const user = await userRepository.findOneBy({ id: args.id });
      if (!user) {
        throw new Error("User not found");
      }
      Object.assign(user, args.edits);
      await userRepository.save(user);
      return user;
    },
    deleteUser: async (_: any, args: { id: number }) => {
      const user = await userRepository.findOneBy({ id: args.id });
      if (!user) {
        throw new Error("User not found");
      }
      await userRepository.delete({ id: args.id });
      return user;
    },
  },
};
