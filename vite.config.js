import { defineConfig } from 'vite';
import { spawn } from 'child_process';
import http from 'http';

function autoBackendPlugin() {
  let backendProc = null;

  async function waitForPort5000(maxRetries = 25) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/health');
        if (res.ok) return true;
      } catch (e) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    return false;
  }

  return {
    name: 'auto-backend-server',
    async configureServer(server) {
      let isRunning = false;
      try {
        const res = await fetch('http://127.0.0.1:5000/api/health');
        isRunning = res.ok;
      } catch (e) {
        isRunning = false;
      }

      if (!isRunning) {
        console.log('[CODEC Dev] Starting backend server on port 5000...');
        backendProc = spawn(process.execPath, ['server/server.js'], {
          stdio: 'inherit'
        });

        backendProc.on('error', (err) => {
          console.error('[CODEC Dev] Failed to start backend server:', err);
        });

        await waitForPort5000();
        console.log('[CODEC Dev] Backend server ready on port 5000.');
      } else {
        console.log('[CODEC Dev] Backend server already running on port 5000.');
      }

      const cleanup = () => {
        if (backendProc) {
          try {
            backendProc.kill();
          } catch (e) {}
        }
      };

      process.on('exit', cleanup);
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
    }
  };
}

export default defineConfig({
  server: {
    port: 5174,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [autoBackendPlugin()]
});

