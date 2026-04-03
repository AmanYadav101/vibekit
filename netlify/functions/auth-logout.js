export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`,
    },
    body: JSON.stringify({ message: "Logged out" }),
  };
};
