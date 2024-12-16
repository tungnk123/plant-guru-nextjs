import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

const authConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = {
          id: '1',
          name: 'John',
          email: credentials?.email as string,
        };

        if (user) {
          return user; // Authentication succeeded
        }

        return null; // Authentication failed
      },
    }),
  ],
  pages: {
    signIn: '/', // Custom sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authConfig;
