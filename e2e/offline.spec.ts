import { expect, test } from '@playwright/test';

// Proves the offline-first promise: edits made while disconnected are held
// locally and merge cleanly once the connection is back.
test('edits made offline sync to peers after reconnect', async ({ browser }) => {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const a = await ctxA.newPage();
  const b = await ctxB.newPage();
  await a.goto('/');
  await b.goto('/');
  await a.getByText('Match Winner').waitFor();
  await b.getByText('Match Winner').waitFor();

  const before = await b.getByTestId('odds-s1').textContent();

  // A drops offline and keeps working
  await ctxA.setOffline(true);
  await a.getByRole('button', { name: 'increase Home odds' }).click();
  await a.getByRole('button', { name: 'increase Home odds' }).click();
  expect(await a.getByTestId('odds-s1').textContent()).not.toBe(before); // applied locally
  await b.waitForTimeout(1000);
  expect(await b.getByTestId('odds-s1').textContent()).toBe(before); // not yet on B

  // A reconnects — the held edits merge and reach B
  await ctxA.setOffline(false);
  await expect
    .poll(async () => b.getByTestId('odds-s1').textContent(), { timeout: 25_000 })
    .not.toBe(before);
  expect(await a.getByTestId('odds-s1').textContent()).toBe(
    await b.getByTestId('odds-s1').textContent(),
  );
});
