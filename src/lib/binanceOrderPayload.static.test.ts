import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const serverSource = fs.readFileSync(path.join(process.cwd(), "server.ts"), "utf-8");

describe("Binance order submit path", () => {
  it("submits Binance futures TP/SL as reduce-only protection orders", () => {
    expect(serverSource).toContain('type: "TAKE_PROFIT_MARKET"');
    expect(serverSource).toContain('type: "STOP_MARKET"');
    expect(serverSource).toContain("reduceOnly: true");
    expect(serverSource).toContain("exchange.createOrder(");
  });

  it("does not keep the old original raw-order route branch alive", () => {
    expect(serverSource).not.toContain("privatePostTradeOrder(orderPayload)");
    expect(serverSource).not.toContain("orderPayload.attachAlgoOrds");
    expect(serverSource).not.toContain("params.tpTriggerPx");
    expect(serverSource).not.toContain("params.slTriggerPx");
    expect(serverSource).not.toContain("exchange.createMarketOrder(ccxtSymbol");
  });
});
