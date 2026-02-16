"use client";

import { WebContainer } from '@webcontainer/api';
import { useState } from 'react';
import { useFileSystemStore } from '@/store/file-system-store';
import { convertFilesToWebContainerTree } from '@/lib/webcontainer-utils';

let webContainerInstance: WebContainer | null = null;

export function useWebContainer() {
  const { files } = useFileSystemStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isBooting, setIsBooting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Boot WebContainer (Singleton)
  const bootContext = async () => {
    if (webContainerInstance) return webContainerInstance;
    
    setIsBooting(true);
    try {
      webContainerInstance = await WebContainer.boot();
      
      webContainerInstance.on('server-ready', (port, url) => {
        console.log(`Server ready at ${url}`);
        setPreviewUrl(url);
      });
      
      return webContainerInstance;
    } catch (error) {
      console.error('Failed to boot WebContainer:', error);
      return null;
    } finally {
      setIsBooting(false);
    }
  };

  const mountFiles = async () => {
    if (!webContainerInstance) return;
    const tree = convertFilesToWebContainerTree(files);
    await webContainerInstance.mount(tree);
  };

  const runCommand = async (command: string, args: string[], onOutput?: (data: string) => void) => {
    if (!webContainerInstance) return;

    const process = await webContainerInstance.spawn(command, args);

    process.output.pipeTo(new WritableStream({
      write(data) {
        if (onOutput) {
            onOutput(data);
        }
      }
    }));

    return process.exit;
  };

  const executeProject = async (outputCallback: (data: string) => void) => {
    if (isRunning) return;
    setIsRunning(true);
    setPreviewUrl(null); // Reset preview URL

    try {
      let instance = webContainerInstance;
      if (!instance) {
        outputCallback('\x1b[34m[System] Booting WebContainer...\r\n\x1b[0m');
        instance = await bootContext();
      }

      if (!instance) {
        outputCallback('\x1b[31m[System] Failed to boot WebContainer.\r\n\x1b[0m');
        return;
      }

      outputCallback('\x1b[34m[System] Mounting files...\r\n\x1b[0m');
      await mountFiles();

      outputCallback('\x1b[34m[System] Running npm install...\r\n\x1b[0m');
      const installExitCode = await runCommand('npm', ['install'], outputCallback);

      if (installExitCode !== 0) {
        outputCallback('\x1b[31m[System] npm install failed.\r\n\x1b[0m');
        return;
      }

      outputCallback('\x1b[32m[System] npm install completed.\r\n\x1b[0m');
      outputCallback('\x1b[34m[System] Starting development server...\r\n\x1b[0m');
      
      // We don't await this because it runs indefinitely
      runCommand('npm', ['run', 'start'], outputCallback);
      
    } catch (error: any) {
      outputCallback(`\x1b[31m[System] Error: ${error.message}\r\n\x1b[0m`);
    } finally {
      setIsRunning(false);
    }
  };

  return {
    boot: bootContext,
    mount: mountFiles,
    run: runCommand,
    executeProject,
    previewUrl,
    isBooting
  };
}
