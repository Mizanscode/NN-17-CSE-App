import { useCallback } from "react";
import { trpc } from "@/providers/trpc";

export function useAuth() {
  const utils = trpc.useUtils();
  const { data: oauthUser, isLoading: oauthLoading } = trpc.auth.me.useQuery(
    undefined,
    { retry: false, refetchOnWindowFocus: false },
  );
  const { data: localUser, isLoading: localLoading } =
    trpc.localAuth.meLocal.useQuery(undefined, {
      retry: false,
      refetchOnWindowFocus: false,
    });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      utils.localAuth.meLocal.invalidate();
    },
  });

  const user = oauthUser || localUser || null;
  const isLoading = oauthLoading || localLoading;
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isModerator = user?.role === "moderator" || isAdmin;

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return { user, isLoading, isAdmin, isModerator, logout };
}
