import { app, BrowserWindow, shell, dialog, ipcMain } from 'electron';
import { spawn } from 'node:child_process';
import { join, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;
const isMac = process.platform === 'darwin';

let serverProcess = null;

function startServer() {
  return new Promise((resolve) => {
    let settled = false;
    const resolveOnce = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    const serverReady = (data) => {
      const msg = data.toString();
      if (msg.includes('Server running at')) {
        resolveOnce();
      }
    };

    const serverDir = join(__dirname, '..');

    if (isDev) {
      const tsxEntry = join(serverDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
      if (!existsSync(tsxEntry)) {
        console.error('tsx entry not found:', tsxEntry);
        resolveOnce();
        return;
      }
      serverProcess = spawn(process.execPath, [tsxEntry, 'watch', 'server/index.ts'], {
        cwd: serverDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
        shell: false,
      });
    } else {
      // Production: run compiled server JS, serve static from dist/
      const serverEntry = join(__dirname, '..', 'dist-server', 'index.js');

      if (!existsSync(serverEntry)) {
        console.error('Server entry not found:', serverEntry);
        resolveOnce();
        return;
      }

      serverProcess = spawn(process.execPath, [serverEntry], {
        cwd: serverDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          SERVE_STATIC: 'dist',
          PORT: '3001',
          ELECTRON_RUN_AS_NODE: '1',
        },
        shell: false,
      });
    }

    serverProcess.stdout?.on('data', serverReady);
    serverProcess.stderr?.on('data', (d) => console.error(d.toString()));
    serverProcess.once('error', (err) => {
      console.error('Failed to start server process:', err);
      resolveOnce();
    });
    serverProcess.once('exit', (code, signal) => {
      if (!settled) {
        console.error(`Server process exited before ready: code=${code} signal=${signal}`);
        resolveOnce();
      }
    });

    // Timeout fallback
    setTimeout(resolveOnce, 8000);
  });
}

function registerIpcHandlers() {
  ipcMain.handle('dialog:selectDirectory', async () => {
    const result = await dialog.showOpenDialog({
      title: '选择图片目录',
      properties: ['openDirectory'],
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    // Normalize path for current platform (Windows: C:\..., Unix: /...)
    const selectedPath = result.filePaths[0];
    return selectedPath;
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 560,
    title: 'ImgView',
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    backgroundColor: '#0D0D0F',
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Open external links in browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.loadURL(`http://localhost:5173?electron=1&platform=${process.platform}`);
  } else {
    // Fastify serves both API + static files
    win.loadURL(`http://localhost:3001?electron=1&platform=${process.platform}`);
  }

  return win;
}

// ── App lifecycle ──

app.whenReady().then(async () => {
  registerIpcHandlers();
  await startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
});
