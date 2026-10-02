import { defineConfig } from 'vite';
import { spawn } from 'child_process';
import http from 'http';

function autoBackendPlugin() {
  let backendProc = null;

  return {
    name: 'auto-backend-server',
    configureServer(server) {
      // Check if backend on port 5000 is already active
      const req = http.get('http://127.0.0.1:5000/api/health', (res) => {
        if (res.statusCode === 200) {
          console.log('[CODEC Dev] Backend server already running on port 5000.');
        }
      });

      req.on('error', () => {
        console.log('[CODEC Dev] Starting backend server on port 5000...');
        backendProc = spawn(process.execPath, ['server/server.js'], {
          stdio: 'inherit'
        });

        backendProc.on('error', (err) => {
          console.error('[CODEC Dev] Failed to start backend server:', err);
        });
      });

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

