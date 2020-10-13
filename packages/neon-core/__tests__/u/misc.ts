import * as misc from "../../src/u/misc";
import { HexString } from "../../src/u/HexString";
import { getSerializedSize } from "../../src/u/misc";

describe("hexXor", () => {
  test("throws if inputs of different length", () => {
    const input1 = "00";
    const input2 = "0001";
    expect(() => misc.hexXor(input1, input2)).toThrow();
  });

  test("Performs bitwise XOR", () => {
    const input1 = "0001101100011011";
    const input2 = "0000000011111111";
    const result = misc.hexXor(input1, input2);
    expect(result).toBe("0001101111100100");
  });
});

describe("reverseArray", () => {
  test("throws if not array", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(() => misc.reverseArray(1)).toThrow();
  });

  test("Reverses an array", () => {
    const input = [1, 2, 3, 4, 5];
    const result = misc.reverseArray(input);
    expect(result).toEqual([5, 4, 3, 2, 1]);
  });
});

describe("reverseHex", () => {
  test("throws if not hexstring", () => {
    expect(() => misc.reverseHex("fg")).toThrow();
  });

  test("Reverses hex", () => {
    const input = "000102030405060708090a0b0c0d0e0f";
    const result = misc.reverseHex(input);
    expect(result).toBe("0f0e0d0c0b0a09080706050403020100");
  });
});

class SerializableObject {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public get size(): number {
    return 2;
  }

  public serialize(): string {
    return "";
  }
}

describe("getVarSize", () => {
  test("size of HexString", () => {
    const input = HexString.fromHex("112233");
    const result = getSerializedSize(input);
    expect(result).toBe(4);
  });

  test("size of number < 0xfd", () => {
    const result = getSerializedSize(0xfc);
    expect(result).toBe(1);
  });

  test("size of number <= 0xffff", () => {
    // lower boundary
    let result = getSerializedSize(0xfd);
    expect(result).toBe(3);
    // upper boundary
    result = getSerializedSize(0xffff);
    expect(result).toBe(3);
  });

  test("size of number > 0xffff", () => {
    const result = getSerializedSize(0xffff + 1);
    expect(result).toBe(5);
  });

  test("array of serializable objects", () => {
    const input = [new SerializableObject(), new SerializableObject()];
    const result = getSerializedSize(input);
    expect(result).toBe(5);
  });

  test("array of hexstring objects", () => {
    const input = [HexString.fromHex("0102"), HexString.fromHex("0304")];
    const result = getSerializedSize(input);
    expect(result).toBe(5);
  });

  test("array of unsupported objects throws", () => {
    expect(() => getSerializedSize([{}, {}])).toThrow(
      "Unsupported value type: object"
    );
  });

  test("unsupported value throws", () => {
    expect(() => getSerializedSize({})).toThrow("Unsupported value type: object");
  });
});
