const axios = require("axios")

// Waiting Function
const waiting = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getLanguageById = (language) => {
  const languageMap = {
    // C family
    "c": 50,
    "gcc": 50,
    "c++": 54,
    "cpp": 54,
    // Java
    "java": 62,
    // JavaScript / Node
    "javascript": 63,
    "java script": 63,
    "js": 63,
    "node": 63,
    "nodejs": 63,
    // Python (commonly asked)
    "python": 71,
    "py": 71,
  };

  if (!language || typeof language !== 'string') {
    throw new Error("Invalid language provided in referenceSolution");
  }

  const key = language.trim().toLowerCase();
  const id = languageMap[key];
  if (!id) {
    throw new Error(`Unsupported language: ${language}`);
  }
  return id;
};

const submitBatch = async (submissions) => {



  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false'
    },
    headers: {
      'X-RapidAPI-Key': process.env.JUDGE0_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: {
      submissions: submissions.map(s => ({
        ...s,
        language_id: Number(s.language_id),
        source_code: s.source_code != null ? String(s.source_code) : "",
        stdin: s.stdin != null ? String(s.stdin) : "",
        expected_output: s.expected_output != null ? String(s.expected_output) : undefined,
      }))
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Judge0 submitBatch ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  return await fetchData();

}

const submitToken = async (resultToken) => {

  if (!Array.isArray(resultToken) || resultToken.length === 0) {
    throw new Error("No tokens to fetch from Judge0");
  }

  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'false'
    },
    headers: {
      'X-RapidAPI-Key': process.env.JUDGE0_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'Accept': 'application/json'
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Judge0 submitToken ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  while (true) {
    const result = await fetchData();
    const submissions = result.submissions || [];

    const allDone = submissions.every((r) => {
      const statusId = (r.status && r.status.id) || r.status_id || 0;
      return statusId > 2; // 1: In Queue, 2: Processing, >2 means finished
    });

    if (allDone) {
      return submissions;
    }

    await waiting(1000);
  }
}

module.exports = { getLanguageById, submitBatch, submitToken };