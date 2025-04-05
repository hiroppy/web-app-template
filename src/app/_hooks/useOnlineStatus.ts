import { useSyncExternalStore } from "react";

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => /* assume online on the server */ true,
  );

  // don't need memoization
  function subscribe(cb: (event: Event) => void) {
    window.addEventListener("online", cb);
    window.addEventListener("offline", cb);

    return () => {
      window.removeEventListener("online", cb);
      window.removeEventListener("offline", cb);
    };
  }

  return { isOnline } as const;
}
