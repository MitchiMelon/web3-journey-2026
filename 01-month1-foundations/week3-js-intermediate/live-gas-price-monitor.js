function mockGasAPI(url) {
  const responses = {
    "https://rpc1.example.com/gas": { safe: 22.5, fast: 35.0, instant: 55.0 },
    "https://rpc2.example.com/gas": { safe: 21.0, fast: 33.5, instant: 52.0 },
    "https://rpc3.example.com/gas": { safe: 24.0, fast: 37.0, instant: 58.0 },
    "https://rpc4.example.com/gas": null, // this one always fails
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = responses[url]
      if (data) resolve(data)
      else reject(new Error(`RPC node unreachable: ${url}`))
    }, 200)
  })
}

const gasUrls = [
  "https://rpc1.example.com/gas",
  "https://rpc2.example.com/gas",
  "https://rpc3.example.com/gas",
  "https://rpc4.example.com/gas", // this one will fail all retries
]

async function fetchGasPrice(url) {
  const maxRetries = 3;
  const delayMs = 1000;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    try {
      const result = await mockGasAPI(url);
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error("Failed after " + maxRetries + " retries: " + error.message);
      }
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

async function fetchAllGasPrices(urls) {
    const promiseArray = urls.map(url => {
        return fetchGasPrice(url).catch(error => {
            return { error: error.message }
        })
    })
    const results = await Promise.all(promiseArray);
    return results;
}

function getSummary(results) {
    const successfulResults = results.filter(result => typeof result.safe === 'number');
    const successfulCount = successfulResults.length;
    const failedCount = results.length - successfulCount;

    let average = 0;
    if (successfulCount > 0) {
        const safeValues = successfulResults.map(result => result.safe);
        const sum = safeValues.reduce((total, value) => total + value, 0);
        average = sum / successfulCount;
        average = Math.round(average * 100) / 100;
    }

    return {
        successful: successfulCount,
        failed: failedCount,
        averageSafeGasPrice: average
    };
}

async function runChallenge1() {
  console.log("--- CHALLENGE 1: Live Gas Price Monitor ---")
  const results = await fetchAllGasPrices(gasUrls)
  console.log("Results:", results)
  console.log("Summary:", getSummary(results))
}

runChallenge1()