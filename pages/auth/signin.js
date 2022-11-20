import { useRouter } from "next/router"
import { Button, Center, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, useToast } from "@chakra-ui/react"
import { getProviders, signIn, getCsrfToken } from "next-auth/react"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { useForm } from "react-hook-form"
import Link from "next/link"

export default function SignIn({ providers, csrfToken }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm()
  const toast = useToast()

  async function handleSignIn(data) {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: `${window.location.origin}`,
      redirect: false,
    });

    if (res.error) {
      toast({
        title: `${res.error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    if (res.url) router.push(res.url);
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" minW={["full", "md"]} p={12} rounded={6}>
        <Heading mb={6}>Log in</Heading>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            {provider.name != 'Credentials' ?
              <Button leftIcon={provider.name === 'Google' ? < FaGoogle /> : < FaGithub />} width="100%" borderRadius={"100vh"} my={2} colorScheme="teal" onClick={() => signIn(provider.id)}>Sign in with {provider.name}</Button>
              : <></>}
          </div>

        ))}

        <Divider my={4} />

        <form onSubmit={handleSubmit(handleSignIn)}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

          <FormControl isInvalid={errors.email} mb={2}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input {...register('email', {
              required: 'This is required',
            })} id="email" name="email" type="email" />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.password} mb={2}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input {...register('password', {
              required: 'This is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })} id="password" name="password" type="password" />
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <Link href={"#"}><a><Text fontSize="sm">Forgot your password?</Text></a></Link>
          <Button width="100%" mt={4} borderRadius={"100vh"} colorScheme="teal" type="submit">Sign in</Button>
        </form>

        <Divider my={4} />

        <Center>Don't have an account?</Center>
        <Link href={"/auth/signup"}>
          <Button width="100%" mt={4} borderRadius={"100vh"} colorScheme="teal" variant='outline'>Sign up</Button>
        </Link>
      </Flex>
    </Flex>
  )
}

export async function getServerSideProps(context) {
  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  return {
    props: { providers, csrfToken },
  }
}