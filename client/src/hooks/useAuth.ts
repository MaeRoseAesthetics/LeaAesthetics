import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logout = () => {
    // Clear the stored token
    localStorage.removeItem('supabase_token');
    
    // Clear all query cache
    queryClient.clear();
    
    // Redirect to home page
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
  };
}
