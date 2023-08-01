# NextAuth Demo Guide

## Setup NextAuth

- Install the next-auth library via `npm i next-auth`
- Configure a Github OAuth App at your github profile, go to _Settings /
  Developer Settings / OAuth Apps_
  - :exclamation: Create one app for production and one for development
  - For production use the production domain as host address
  - For development use http://localhost:3000
    - Callback URL: Host + `/api/auth/callback/github`
    - Copy **Client ID** and **Client Secret**
- Create a `.env.local` file in the root of your project and add the client id
  and the secret:
  ```
  GITHUB_ID=[Client Id]
  GITHUB_SECRET=[Client Secret]
  ```
- Additionally create a NextAuth secret by running this command in terminal:
  ```bash
  openssl rand -base64 32
  ```
- Add the generated secret to the `.env.local` file:
  ```
  NEXTAUTH_SECRET=[generated secret]
  ```
- Add the nextauth API route: `/pages/api/auth/[...nextauth].js` and add the
  following code:

  ```js
  import NextAuth from "next-auth";
  import GithubProvider from "next-auth/providers/github";
  export const authOptions = {
    // Configure one or more authentication providers
    providers: [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
      // ...add more providers here
    ],
  };
  export default NextAuth(authOptions);
  ```

- Wrap the session provider around the all components that need the session data in \`\_app.js` and add the session as prop:

  ```js
  import { SessionProvider } from "next-auth/react";

  function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
      <>
        <GlobalStyles />
        <StyledContainer>
          <h1>🐬 Next Auth Demo 🐬</h1>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </StyledContainer>
      </>
    );
  }

  export default MyApp;
  ```

## Login / Logout

- In `/pages/index.js`, import the `useSession` hook and `signIn` and `signOut`
  functions:
  ```js
  import { useSession, signIn, signOut } from "next-auth/react";
  ```
- Use the `useSession` hook to obtain a session object:
  ```js
  const { data: session } = useSession();
  ```
  You will get an Object with `email`, `image`, `name` properties for the user in `session.user` if a a user is logged in.
- Replace the login button in `index.js` with the following code:

  ```js
  <StyledSection>
  {
    // check if we have session data (= user is already signed in => display a logout button)
    session ? (
      <>
        <StyledButton onClick={signOut}>Logout</StyledButton>
        <p>Signed in as {session.user.email}</p>
      </>
    ) : (
        // no session data available yet, display a login button
      <StyledButton
        onClick={() => {
          signIn();
        }}
      >
        Login
      </StyledButton>
    )
  }
  <StyledSection>
  ```

- The login button uses the `signIn` function provided by NextAuth, the logout
  button uses the `signOut` function.
- You should now be able to log in and out. The very first time you sign in,
  `GitHub` will ask you if you want to share some of your profile information
  with your app - please confirm.

## Protect the detail page

- First, change the detail API route (`/pages/api/fish/[id].js`) to return a
  `401` HTTP error (unauthorized) if the logged in user doesn't match the fish.
  Use the `getServerSession` function provided by `next-auth/next`:

  ```js
  import { authOptions } from "@/pages/api/auth/[...nextauth]";
  import { getServerSession } from "next-auth/next";

  //...

  //... use this code in the try block:
  const session = await getServerSession(req, res, authOptions);
  // check if a user is logged in
  if (!session) {
    return res.status(401).json({ msg: "please log in" });
  }
  const fish = fishData.find((fish) => fish.id === id);
  if (!fish) {
    return res.status(404).json({ message: "fish not found" });
  }
  // check if user email is the same as in fish data
  if (session.user.email !== fish.email) {
    return res
      .status(401)
      .json({ msg: "you are not allowed to see this fish" });
  }
  return res.status(200).json(fish);
  ```

- On the detail page(`/pages/fish/[id].js`) you should react to the 401 error, for example like this:

  ```js
  //inspect status code if response not ok:
  if (error) {
    if (error.status === 401) {
      return (
        <StyledContainer>
          <UnauthorizedCard />
        </StyledContainer>
      );
    }
    return <p>Error: {error.message}</p>;
  }
  ```

- You should now see only data for the logged in fish.
- FishCard should show an "Unauthorized" message for all other fish.
- Calling the API route `/api/fish/[id]` is now only accessible for the
  logged in fish.

## Deployment

- Make sure you use the `GITHUB_ID` and `GITHUB_SECRET` from the respective
  OAuth app you configured in GitHub (for production use).
- Generate a NextAuth secret for production, too by executing
  (`openssl rand -base64 32` in Terminal) and set the Environment variables in
  Vercel accordingly, including `NEXTAUTH_SECRET`
- You should now be able to deploy the app.

## Workaround for the Vercel Preview Environment

- The app will not allow you to log in in the preview environment Vercel creates
  as part of the Pull Request process.
- Vercel provides a special environment variable that allows us to identify in
  which environment we are running: `VERCEL_ENV`
- As a workaround, we replace the GitHub provider with a dummy
  `Credentials Provider` in case we are running on preview.
- In `/pages/api/auth/[...nextauth].js` adjust as follows:

  ```js
  import NextAuth from "next-auth";
  import GithubProvider from "next-auth/providers/github";
  import CredentialsProvider from "next-auth/providers/credentials";

  const providers = [];
  // Check if we are running on preview
  if (process.env.VERCEL_ENV === "preview") {
    providers.push(
      // Create a credentials provider with dummy data, describing input fields:
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "fish" },
          password: { label: "Password", type: "password" },
        },
        // and adding a fake authorization with static username and password:
        async authorize(credentials) {
          if (
            credentials.username === "fish" &&
            credentials.password === "fishbone"
          ) {
            return {
              id: "1",
              name: "Flipper",
              email: "YOUR-EMAIL-USED@github",
            };
          } else {
            return null;
          }
        },
      })
    );
  } else {
    // If not on preview, we use the GithubProvider as before
    providers.push(
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      })
    );
  }

  export const authOptions = {
    providers,
  };

  export default NextAuth(authOptions);
  ```

:exclamation: Make sure to configure the correct email address in the
`authorize` callback! This email address has to match a fish for the app to
work.

:exclamation: Chrome warns that the password is unsafe. Of course you can use a
different password in the in the `authorize` callback to prevent this.

---

- Docs:
  [NextAuth Getting Started](https://next-auth.js.org/getting-started/example)
