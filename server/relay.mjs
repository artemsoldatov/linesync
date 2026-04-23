// A tiny room-scoped broadcast relay for y-websocket clients. It keeps no
// server-side document — it just forwards each peer's raw protocol messages to
// the other peers in the same room, so the Yjs clients sync among themselves
// (the same model y-webrtc uses). Version-independent and stateless.
import { WebSocketServer } from 'ws';

const port = Number(process.env.PORT ?? 51234);
const host = process.env.HOST ?? '127.0.0.1';

const rooms = new Map();

const wss = new WebSocketServer({ host, port });

wss.on('connection', (socket, req) => {
  const room = decodeURIComponent((req.url ?? '/').slice(1).split('?')[0]) || 'default';
  let peers = rooms.get(room);
  if (!peers) {
    peers = new Set();
    rooms.set(room, peers);
  }
  peers.add(socket);

  socket.on('message', (data, isBinary) => {
    for (const peer of peers) {
      if (peer !== socket && peer.readyState === peer.OPEN) {
        peer.send(data, { binary: isBinary });
      }
    }
  });

  socket.on('close', () => {
    peers.delete(socket);
    if (peers.size === 0) rooms.delete(room);
  });
});

console.log(`linesync relay on ws://${host}:${port}`);
