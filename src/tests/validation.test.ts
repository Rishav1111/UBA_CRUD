import { describe, it, expect, vi } from "vitest";

import userSchema from "../model/userSchema";

const validUser = {
  fullname: "John Doe",
  age: 25,
  phoneNumber: "1234567890",
  email: "john.doe@example.com",
  password: "securePassword123",
};

const invalidUsers = {
  missingFullname: {
    age: 25,
    phoneNumber: "1234567890",
    email: "john.doe@example.com",
    password: "securePassword123",
  },
  shortFullname: {
    fullname: "JD",
    age: 25,
    phoneNumber: "1234567890",
    email: "john.doe@example.com",
    password: "securePassword123",
  },
  invalidAge: {
    fullname: "John Doe",
    age: "twenty-five", // Age is not a number
    phoneNumber: "1234567890",
    email: "john.doe@example.com",
    password: "securePassword123",
  },
  invalidPhoneNumber: {
    fullname: "John Doe",
    age: 25,
    phoneNumber: "12345abcde", // Phone number contains non-numeric characters
    email: "john.doe@example.com",
    password: "securePassword123",
  },
  invalidEmail: {
    fullname: "John Doe",
    age: 25,
    phoneNumber: "1234567890",
    email: "john.doe@com", // Invalid email format
    password: "securePassword123",
  },
  shortPassword: {
    fullname: "John Doe",
    age: 25,
    phoneNumber: "1234567890",
    email: "john.doe@example.com",
    password: "short",
  },
};

describe("User Schema Validation", () => {
  it("should validate a correct user object", () => {
    const { error, value } = userSchema.validate(validUser);
    expect(error).toBeUndefined();
    expect(value).toEqual(validUser);
  });

  it("should invalidate a user object missing fullname", () => {
    const { error } = userSchema.validate(invalidUsers.missingFullname);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toContain('"fullname" is required');
  });

  it("should invalidate a user object with short fullname", () => {
    const { error } = userSchema.validate(invalidUsers.shortFullname);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toContain(
      '"fullname" length must be at least 3 characters long'
    );
  });

  it("should invalidate a user object with non-integer age", () => {
    const { error } = userSchema.validate(invalidUsers.invalidAge);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toContain('"age" must be a number');
  });

  it("should invalidate a user object with non-numeric phone number", () => {
    const { error } = userSchema.validate(invalidUsers.invalidPhoneNumber);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toContain(
      '"phoneNumber" with value "12345abcde" fails to match the required pattern'
    );
  });

  it("should invalidate a user object with an invalid email format", () => {
    const { error } = userSchema.validate(invalidUsers.invalidEmail);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toContain(
      '"email" must be a valid email'
    );
  });

  it("should invalidate a user object with a short password", () => {
    const { error } = userSchema.validate(invalidUsers.shortPassword);
    expect(error).toBeDefined();
    expect(error!.details[0].message).toContain(
      '"password" length must be at least 8 characters long'
    );
  });
});
