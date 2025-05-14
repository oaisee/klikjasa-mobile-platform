
import { Toast, toast as sonnerToast } from "sonner";
import { useToast as useShadcnToast } from "@/components/ui/toast";

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
  
  // Also trigger shadcn toast for backward compatibility
  const { toast: shadcnToast } = useShadcnToast();
  shadcnToast(props);
  
  return props;
};

export const useToast = () => {
  const shadcnToast = useShadcnToast();
  
  return {
    ...shadcnToast,
    toast
  };
};
