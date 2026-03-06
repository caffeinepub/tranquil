import { toast } from "sonner";

export function handleBackendError(
  error: unknown,
  fallbackMessage = "Something went wrong",
): void {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("Unauthorized")) {
      toast.error("You need to be logged in to perform this action.");
    } else if (msg.includes("not found")) {
      toast.error("Resource not found.");
    } else {
      toast.error(msg || fallbackMessage);
    }
  } else {
    toast.error(fallbackMessage);
  }
}
