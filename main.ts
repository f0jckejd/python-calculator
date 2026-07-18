addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(req: Request): Promise<Response> {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("Only WebSocket supported", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    // تم وضع رابط السيرفر الخاص بك هنا بناءً على البيانات المرفقة
    const target = new WebSocket("wss://fr.connfull.org:9443/stream");

    target.onopen = () => {
      socket.onmessage = (e) => target.send(e.data);
      target.onmessage = (e) => socket.send(e.data);
    };

    target.onerror = () => socket.close(1011, "target error");
    target.onclose = () => socket.close(1000, "target closed");
  };

  socket.onerror = () => {};

  return response;
}
