Deno.serve((req: Request) => {
  const upgrade = req.headers.get("upgrade") || "";

  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Only WebSocket supported", {
      status: 400,
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    // تم الحفاظ على رابط الخادم الهدف الخاص بك
    const target = new WebSocket("wss://fr.connfull.org:9443/stream");

    target.onopen = () => {
      socket.onmessage = (e) => target.send(e.data);
      target.onmessage = (e) => socket.send(e.data);
    };

    target.onerror = () => {
      socket.close(1011, "Target error");
    };

    target.onclose = () => {
      socket.close(1000, "Target closed");
    };
  };

  socket.onerror = () => {};

  return response;
});
  return response;
}
