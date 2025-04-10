import { test } from '@playwright/test';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const websites = [
  { name: 'USAT', url: 'https://www.usatoday.com/money/blueprint/' },
  { name: 'Advisor Journey', url: 'https://travelinsurance.advisorjourney.forbes.com/search/' },
  { name: 'Forbes AU', url: 'https://www.forbes.com/advisor/au/' },
  { name: 'Forbes IT', url: 'https://www.forbes.com/advisor/it/' },
  { name: 'Forbes CA', url: 'https://www.forbes.com/advisor/ca/' }
];

const webhook = process.env.SLACK_URL;

test('Check all websites and report to Slack', async () => {
  let statusMessages: string[] = [];

  for (const site of websites) {
    try {
      const res = await fetch(site.url);
      if (res.status === 200) {
        statusMessages.push(`✅ ${site.name} site is good`);
      } else {
        statusMessages.push(`⚠️ ${site.name} returned status ${res.status}`);
      }
    } catch {
      statusMessages.push(`❌ ${site.name} is not reachable`);
    }
  }

  const payload = {
    text: `🌐 Website Status:\n${statusMessages.join('\n')}`
  };

  if (webhook) {
    await axios.post(webhook, payload);
  } else {
    console.error('SLACK_URL not found in environment');
  }
});
