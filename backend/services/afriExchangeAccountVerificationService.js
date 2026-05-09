const axios = require("axios");

const verifyAfriExchangeAccountLink = async ({
  afriExchangeUserId,
  walletAddress,
  accountEmail,
  tokenType = "CT",
}) => {
  const baseUrl = process.env.AFRIEXCHANGE_API_URL;
  const apiKey = process.env.AFRIEXCHANGE_KAALIS_API_KEY;

  if (!baseUrl || !apiKey) {
    const error = new Error(
      "AfriExchange verification is not configured. Set AFRIEXCHANGE_API_URL and AFRIEXCHANGE_KAALIS_API_KEY."
    );
    error.statusCode = 503;
    throw error;
  }

  try {
    const response = await axios.post(
      `${baseUrl.replace(/\/$/, "")}/integrations/kaalis/verify-account`,
      {
        afriExchangeUserId,
        walletAddress,
        accountEmail,
        tokenType,
      },
      {
        headers: {
          "x-kaalis-api-key": apiKey,
        },
        timeout: 15000,
      }
    );

    return response.data?.data;
  } catch (error) {
    const responseMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message;

    const wrappedError = new Error(responseMessage || "AfriExchange account verification failed");
    wrappedError.statusCode = error.response?.status || error.statusCode || 500;
    throw wrappedError;
  }
};

const requestAfriExchangeLinkVerification = async ({
  afriExchangeUserId,
  walletAddress,
  accountEmail,
  tokenType = "CT",
}) => {
  const baseUrl = process.env.AFRIEXCHANGE_API_URL;
  const apiKey = process.env.AFRIEXCHANGE_KAALIS_API_KEY;

  if (!baseUrl || !apiKey) {
    const error = new Error(
      "AfriExchange verification is not configured. Set AFRIEXCHANGE_API_URL and AFRIEXCHANGE_KAALIS_API_KEY."
    );
    error.statusCode = 503;
    throw error;
  }

  try {
    const response = await axios.post(
      `${baseUrl.replace(/\/$/, "")}/integrations/kaalis/link-verification/request`,
      {
        afriExchangeUserId,
        walletAddress,
        accountEmail,
        tokenType,
      },
      {
        headers: {
          "x-kaalis-api-key": apiKey,
        },
        timeout: 15000,
      }
    );

    return response.data?.data;
  } catch (error) {
    const responseMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message;

    const wrappedError = new Error(responseMessage || "Failed to request AfriExchange verification code");
    wrappedError.statusCode = error.response?.status || error.statusCode || 500;
    throw wrappedError;
  }
};

const confirmAfriExchangeLinkVerification = async ({ requestId, code }) => {
  const baseUrl = process.env.AFRIEXCHANGE_API_URL;
  const apiKey = process.env.AFRIEXCHANGE_KAALIS_API_KEY;

  if (!baseUrl || !apiKey) {
    const error = new Error(
      "AfriExchange verification is not configured. Set AFRIEXCHANGE_API_URL and AFRIEXCHANGE_KAALIS_API_KEY."
    );
    error.statusCode = 503;
    throw error;
  }

  try {
    const response = await axios.post(
      `${baseUrl.replace(/\/$/, "")}/integrations/kaalis/link-verification/confirm`,
      { requestId, code },
      {
        headers: {
          "x-kaalis-api-key": apiKey,
        },
        timeout: 15000,
      }
    );

    return response.data?.data;
  } catch (error) {
    const responseMessage =
      error.response?.data?.message ||
      error.response?.data?.error?.message ||
      error.message;

    const wrappedError = new Error(responseMessage || "Failed to confirm AfriExchange verification code");
    wrappedError.statusCode = error.response?.status || error.statusCode || 500;
    throw wrappedError;
  }
};

module.exports = {
  verifyAfriExchangeAccountLink,
  requestAfriExchangeLinkVerification,
  confirmAfriExchangeLinkVerification,
};
