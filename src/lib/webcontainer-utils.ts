import { FileSystemTree } from '@webcontainer/api';
import { File } from '@/store/file-system-store';

export function convertFilesToWebContainerTree(files: Record<string, File>): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const [path, file] of Object.entries(files)) {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const parts = cleanPath.split('/');
    
    let currentLevel = tree;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      
      if (isFile) {
        currentLevel[part] = {
          file: {
            contents: file.content
          }
        };
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            directory: {}
          };
        }
        
        // Type narrowing for directory
        const entry = currentLevel[part];
        if ('directory' in entry) {
          currentLevel = entry.directory;
        } else {
          // Verify if we have a collision (file and directory with same name)
          console.error(`Collision detected at ${part} in path ${path}`);
          break; 
        }
      }
    }
  }
  
  return tree;
}
