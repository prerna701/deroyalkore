import { randomUUID } from 'crypto';

interface AdminSession {
  email: string;
  role: 'admin';
  expiresAt: number;
}

const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

class AuthService {
  private sessions = new Map<string, AdminSession>();

  isValidAdminCredentials(email: string, password: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    return (
      (normalizedEmail === 'admin@krishclinic.com' || normalizedEmail === 'admin@example.com') &&
      (normalizedPassword === 'admin123' || normalizedPassword === 'Admin@123')
    );
  }

  createAdminSession(email: string) {
    this.removeExpiredSessions();

    const token = randomUUID();
    const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;

    this.sessions.set(token, {
      email: email.trim().toLowerCase(),
      role: 'admin',
      expiresAt,
    });

    return {
      token,
      expires: new Date(expiresAt).toISOString(),
    };
  }

  validateAdminToken(token: string): AdminSession | null {
    const session = this.sessions.get(token);

    if (!session) {
      return null;
    }

    if (session.expiresAt <= Date.now()) {
      this.sessions.delete(token);
      return null;
    }

    return session;
  }

  private removeExpiredSessions() {
    const now = Date.now();

    for (const [token, session] of this.sessions.entries()) {
      if (session.expiresAt <= now) {
        this.sessions.delete(token);
      }
    }
  }
}

export const authService = new AuthService();
