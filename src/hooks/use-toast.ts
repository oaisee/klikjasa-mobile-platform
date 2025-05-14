
import { toast as sonnerToast } from "sonner";

// Compatibility layer for using sonner toast in our app
export const toast = (message: string, options?: { description?: string }) => {
  return sonnerToast(message, {
    description: options?.description
  });
};

// For backward compatibility with useToast pattern
export const useToast = () => {
  return {
    toast
  };
};
