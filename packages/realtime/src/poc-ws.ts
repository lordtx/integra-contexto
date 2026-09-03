import { RealtimeGateway } from './index.js';

async function main() {
  const gateway = new RealtimeGateway();
  const server = gateway.getServer();

  server.listen(3001, () => {
    console.log('WebSocket server on :3001');
  });

  // Simula publicação de eventos
  setInterval(async () => {
    await gateway.publish({
      type: 'chat:new',
      payload: {
        roomId: 'default',
        message: 'Hello from POC!',
        username: 'bot',
      },
      timestamp: new Date(),
    });
  }, 3000);

  console.log('POC WebSocket rodando. Pressione Ctrl+C para sair.');
}

main().catch(console.error);