import { create } from 'zustand';

export type File = {
  name: string;
  language: string;
  content: string;
};

interface FileSystemState {
  files: Record<string, File>;
  activeFile: string | null;
  selectFile: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  loadChallenge: (challenge: any) => void;
}

const INITIAL_FILES: Record<string, File> = {
  // ... existing initial files ... 
  // We keep INITIAL_FILES as is for default state, but loadChallenge will overwrite
};

// ... existing INITIAL_FILES definition ...

export const useFileSystemStore = create<FileSystemState>((set) => ({
  files: INITIAL_FILES,
  activeFile: '/src/App.tsx',
  selectFile: (path) => set({ activeFile: path }),
  updateFileContent: (path, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: {
          ...state.files[path],
          content,
        },
      },
  })),
  loadChallenge: (challenge) => 
    set(() => {
        const newFiles: Record<string, File> = {};
        
        // Map challenge filesystem to store format
        Object.entries(challenge.filesystem).forEach(([path, fileData]: [string, any]) => {
            const name = path.split('/').pop() || 'unknown';
            const ext = name.split('.').pop() || 'txt';
            const language = ext === 'jsx' || ext === 'js' ? 'javascript' 
                           : ext === 'tsx' || ext === 'ts' ? 'typescript'
                           : ext === 'css' ? 'css'
                           : ext === 'html' ? 'html'
                           : ext === 'json' ? 'json'
                           : 'plaintext';
                           
            newFiles[path] = {
                name,
                language,
                content: fileData.content
            };
        });
        
        // Ensure critical config files exist if not provided by AI (though prompt asks for them, we might want to merge or ensure defaults)
        // For now, we trust the AI or the schema to provide a complete runnable environment, 
        // OR we merge with a base template. 
        // Let's assume we replace everything but might want to keep some static config if missing.
        // Actually, safe bet is to merge with INITIAL_FILES but overwrite collisions.
        
        return {
            files: newFiles,
            activeFile: "/src/App.tsx" // Default entry point
        };
    })
}));
