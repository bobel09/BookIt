// A wrapper for fetch that handles JWT expiration and 401 errors
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  if (res.status === 401) {
    try {
      const data = await res.clone().json();
      if (
        data?.message === "jwt expired" ||
        data?.message === "Invalid token"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?expired=1";
      }
    } catch (e) {
      // If not JSON, just redirect on 401
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login?expired=1";
    }
  }
  return res;
}
