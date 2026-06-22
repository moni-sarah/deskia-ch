import { useServerFn } from "@tanstack/react-start";
import { trackBooking } from "@/lib/public.functions";
import { getAttribution } from "@/lib/attribution";

export function useTrackCalendlyClick() {
  const fn = useServerFn(trackBooking);
  return (destination: string, kind: "calendly" | "calendly_15" | "calendly_30" = "calendly") => {
    try {
      void fn({
        data: {
          kind,
          destination,
          page_path: typeof window !== "undefined" ? window.location.pathname : null,
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
          attribution: getAttribution(),
        },
      });
    } catch {/* non-blocking */}
  };
}
