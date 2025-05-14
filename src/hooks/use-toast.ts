
import { toast as sonnerToast } from "sonner";
import { type ToastProps } from "@/components/ui/toast";
import { useToast as useShadcnToast } from "@/components/ui/use-toast";

type ToastTypes = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

// Combining both toast systems for compatibility
export const toast = (props: ToastTypes) => {
  // Use Sonner toast for simpler notifications
  sonnerToast[props.variant === "destructive" ? "error" : "success"](
    props.title || "",
    {
      description: props.description,
      duration: props.duration || 5000,
    }
  );
  
  return props;
};

export const useToast = () => {
  // Import from the correct location and return the toast function
  return {
    toast,
    // Add any other properties you need
    toasts: [] // Empty array for compatibility with shadcn toast
  };
};
