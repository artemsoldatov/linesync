import { expect, test, type Page } from '@playwright/test';

// Opens two independent browser contexts (two "users") against one room and
// proves the board syncs live — the core promise of the app.
async function twoClients(browser: import('@playwright/test').Browser): Promise<[Page, Page]> {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const a = await ctxA.newPage();
  const b = await ctxB.newPage();
  await a.goto('/');
  await b.goto('/');
  await a.getByText('Match Winner').waitFor();
  await b.getByText('Match Winner').waitFor();
  return [a, b];
}

test('an odds change on one client shows up live on the other', async ({ browser }) => {
  const [a, b] = await twoClients(browser);

  const before = await b.getByTestId('odds-s1').textContent();
  await a.getByRole('button', { name: 'increase Home odds' }).click();

  await expect
    .poll(async () => b.getByTestId('odds-s1').textContent())
    .not.toBe(before);
  // both peers converge on the same value
  expect(await a.getByTestId('odds-s1').textContent()).toBe(
    await b.getByTestId('odds-s1').textContent(),
  );
});

test('a selection added to the shared slip on one client appears on the other', async ({
  browser,
}) => {
  const [a, b] = await twoClients(browser);

  await a.getByRole('button', { name: 'add to slip Home' }).click();

  // B sees Home in the shared slip and a 1-fold parlay
  await expect(b.getByText('1-fold parlay')).toBeVisible();
});
