void (async () => {
  const login = await fetch("http://127.0.0.1:3000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL,
      password: process.env.PAYLOAD_ADMIN_PASSWORD,
    }),
  });
  if (!login.ok) process.exit(1);

  const { token } = await login.json();
  const users = await fetch("http://127.0.0.1:3000/api/users?limit=1", {
    headers: { Authorization: `JWT ${token}` },
  });
  if (!users.ok) process.exit(1);

  const { docs } = await users.json();
  const update = await fetch(`http://127.0.0.1:3000/api/users/${docs[0].id}`, {
    method: "PATCH",
    headers: { Authorization: `JWT ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.HANDOVER_ADMIN_EMAIL,
      password: process.env.HANDOVER_ADMIN_PASSWORD,
      roles: ["admin"],
    }),
  });
  console.log(update.status);
  process.exit(update.ok ? 0 : 1);
})();
