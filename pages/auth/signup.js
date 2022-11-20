import { useRouter } from "next/router"
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, useToast } from "@chakra-ui/react"
import { getCsrfToken, signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import Link from "next/link"

export default function SignUp({ csrfToken }) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm()
  const toast = useToast()

  async function handleSignUp(data) {
    const res = await fetch("http://localhost:4000/auth/signup", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json", "Accept-Language": "en-US" }
    })
    const { user, error } = await res.json()

    if (!res.ok && error) {
      toast({
        title: `${error}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
    if (res.ok && user) {
      const resp = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: `${window.location.origin}`,
        redirect: false,
      });

      if (resp.url) router.push(resp.url);
    }
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" minW={["full", "md"]} p={12} rounded={6}>
        <Heading mb={6}>Register</Heading>

        <form onSubmit={handleSubmit(handleSignUp)}>
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

          <Button width="100%" mt={4} borderRadius={"100vh"} colorScheme="teal" type="submit">Sign up</Button>
        </form>
        <Text textAlign={['center', 'right']} mt={6} fontSize="sm">Already registered <Link href={"/auth/signin"}>sign in?</Link></Text>
      </Flex>
    </Flex>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}