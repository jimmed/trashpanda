import { number } from "../../number";
import { fields } from "../fields";
import { merge } from "../merge";
import { encoded, context, user } from "./fixtures";

describe("merge", () => {
  const codec = merge(
    fields({ age: number.UInt8 }),
    fields({ money: number.BigUInt64LE })
  );

  describe("parse", () => {
    beforeEach(() => {
      jest.spyOn(number.UInt8, "parse");
      jest.spyOn(number.BigUInt64LE, "parse");
    });

    it("correctly parses an object", () => {
      expect(codec.parse(encoded, context)).toEqual({
        byteLength: 9,
        value: { ...context, ...user },
      });
    });

    it("parses each field in order", () => {
      codec.parse(encoded, context);
      expect(number.UInt8.parse).toHaveBeenCalledWith(encoded, context);
      expect(number.BigUInt64LE.parse).toHaveBeenCalledWith(encoded.slice(1), {
        ...context,
        age: user.age,
      });
    });
  });

  describe("serialize", () => {
    beforeEach(() => {
      jest.spyOn(number.UInt8, "serialize");
      jest.spyOn(number.BigUInt64LE, "serialize");
    });

    it("correctly serializes an object", () => {
      expect(codec.serialize(user)).toEqual(encoded);
    });

    it("serializes each field in order", () => {
      codec.serialize(user);
      expect(number.UInt8.serialize).toHaveBeenCalledWith(user.age);
      expect(number.BigUInt64LE.serialize).toHaveBeenCalledWith(user.money);
    });
  });
});