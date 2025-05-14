
import { toast } from "sonner";

// This is the correct implementation for toast using Sonner
export { toast };

// For backward compatibility with useToast pattern
export const useToast = () => {
  return {
    toast
  };
};
