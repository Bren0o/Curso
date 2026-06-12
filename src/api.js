// Camada de acesso à API do backend próprio (mesma origem, cookie HttpOnly).
// Se o backend não estiver no ar, o app segue funcionando só com localStorage.

const json = { "Content-Type": "application/json" };

export const api = {
  // Retorna { disponivel, user } — disponivel=false quando não há backend
  async me() {
    try {
      const res = await fetch("/api/me");
      if (res.status === 401) return { disponivel: true, user: null };
      if (!res.ok) return { disponivel: false, user: null };
      const { user } = await res.json();
      return { disponivel: true, user };
    } catch {
      return { disponivel: false, user: null };
    }
  },

  async carregarProgresso() {
    const res = await fetch("/api/progresso");
    if (!res.ok) throw new Error("falha ao carregar progresso");
    return res.json();
  },

  salvarProgresso(feitas, hora) {
    return fetch("/api/progresso", {
      method: "PUT",
      headers: json,
      body: JSON.stringify({ feitas, hora }),
    });
  },

  entrar() {
    window.location.href = "/api/auth/github";
  },

  async sair() {
    await fetch("/api/auth/logout", { method: "POST" });
  },
};
