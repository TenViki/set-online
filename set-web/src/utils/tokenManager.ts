export class TokenManager {
  private static token: string | null;

  public static loadToken() {
    this.token = localStorage.getItem("token");
  }

  public static saveToken(token: string) {
    localStorage.setItem("token", token);
    this.token = token;
  }

  public static getToken(): string | null {
    return this.token;
  }

  public static removeToken() {
    localStorage.removeItem("token");
    this.token = null;
  }
}
