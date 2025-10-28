import NextAuth, { User, Account, Profile } from "next-auth";
import GitHub from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id,
          login: profile.login,
          avatar_url: profile.avatar_url,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
  ],

  events: {
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      if (!account || !profile) return;

      const githubProfile = profile as {
        id: number;
        login: string;
        avatar_url: string;
      };

      try {
        const response = await fetch(`${process.env.BACKEND_URL}/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            githubId: githubProfile.id,
            username: githubProfile.login,
            avatarUrl: githubProfile.avatar_url,
            accessToken: account.access_token,
          }),
        });

        console.log("Backend response:", await response.json());
      } catch (err) {
        console.error("Error syncing user to backend:", err);
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
