void (async () => {
  const response = await fetch("http://127.0.0.1:3000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL,
      password: process.env.PAYLOAD_ADMIN_PASSWORD,
      roles: ["admin"],
    }),
  });

  console.log(response.status);
  process.exit(response.ok ? 0 : 1);
})();
