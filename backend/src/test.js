import { fetchUserAudit } from './services/github.service.js';

async function test() {
  try {
    console.log("Fetching...");
    const data = await fetchUserAudit("krishSRM");
    console.log("Success");
  } catch(e) {
    console.error("Failed", e);
  }
}

test();
