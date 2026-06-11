# Blinq Cross-Venue Arb Scanner

Live scanner for cross-venue prediction-market arbitrage (Polymarket × Kalshi × Limitless) with Blinq leverage economics and the Blinq Composite index price. Companion to the [Leverage-Risk Scanner](https://jumpriskpm.netlify.app/).

## Deploy (Vercel)

```bash
cd "Arb Scanner"
npx vercel deploy --prod
```

That's it — `index.html` is static and `api/proxy.js` auto-deploys as a serverless function (used only as CORS fallback; Polymarket APIs typically allow direct browser calls, Kalshi/Limitless vary).

Local test: `npx vercel dev` (proxy works) or `npx serve` (direct calls only).

## How it works

- **Curated pairs** resolve at runtime (Kalshi series tickers, PM search, Limitless scan) so the page survives market churn. Edit the `PAIRS` array in `index.html` to pin specific tickers/slugs or add pairs.
- **Depth filter**: spread must survive a $10K (configurable) taker fill on both legs, VWAP-walked from live order books (PM CLOB, Kalshi orderbook). Top-of-book-only quotes are flagged `TOB`.
- **Net edge** = gross spread − Kalshi fee (0.07·P·(1−P)) − PM taker fee (where enabled) − Blinq costs on the levered leg, shown at **retail tier** (20bps RT + 100bps vig RT + 43.8% APR borrow) and **MM tier** (10bps RT, no vig, 12% APR borrow). Annualized by expected hold.
- **Blinq Composite** = depth-weighted mid across venues, PM-anchored at 60% — candidate mark-price methodology; per-venue deviation is the rich/cheap signal.

## Caveats

- Contract fine print differs across venues (resolution source, deadlines, tie-breaks) — every card shows an equivalence warning. A spread is sometimes the fine print, not free money.
- Skew-funding receipts (which subsidize the minority-side leg on Blinq) are not modeled — real net edge on Blinq can be better than shown.
- Margin-path risk is not modeled: the hedged-at-settlement position can still be liquidated on the levered leg mid-flight. Run below max leverage.
- Limitless taker fees vary by market and are not modeled.

Research tooling, not investment advice. Fee tiers mirror `GTM/05-Daily-Economics-Model.xlsx`.
