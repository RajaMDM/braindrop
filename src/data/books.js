// PDF URLs served through Cloudflare Worker → R2 bucket
const PROXY = 'https://braindrop-ai-proxy.raja-cloudmdm.workers.dev/pdf';

export const R2_URL = PROXY;

export const BOOKS = {
  10: {
    mathematics: `${PROXY}/grade10/maths.pdf`,
    science: `${PROXY}/grade10/science.pdf`,
    english: `${PROXY}/grade10/english.pdf`,
    'social-science': `${PROXY}/grade10/socialscience.pdf`,
    hindi: `${PROXY}/grade10/hindi.pdf`,
  },
  7: {
    mathematics: `${PROXY}/grade7/maths.pdf`,
    science: `${PROXY}/grade7/science.pdf`,
    english: `${PROXY}/grade7/english.pdf`,
    'social-science': `${PROXY}/grade7/socialscience.pdf`,
    hindi: `${PROXY}/grade7/hindi.pdf`,
  },
};
