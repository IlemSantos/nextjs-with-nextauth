import { useRouter } from "next/router"
import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, useToast } from "@chakra-ui/react"
import { getCsrfToken, signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import Link from "next/link"

export default function SignUp() {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm()
  const toast = useToast()

  function view_toast(error) {
    toast({
      title: `${error}`,
      status: "error",
      duration: 3000,
      isClosable: true,
    })
  }

  async function handleSignUp(udata) {
    const resp = await fetch("/api/signup", {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(udata),
    }).then(resp => resp.json())

    const { error } = resp

    if (resp.ok && error) {
      view_toast(error);
    } else {
      const res = await signIn("credentials", {
        email: udata.email,
        password: udata.password,
        callbackUrl: `${window.location.origin}`,
        redirect: false,
      });

      if (res.error) {
        view_toast(res.error);
      }

      if (res.url) router.push(res.url);
    }
  }

  return (
    <>
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" background="gray.100" p={12} rounded={6}>
          <Heading mb={6}>Register</Heading>

          <form onSubmit={handleSubmit(handleSignUp)}>
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
          <Text textAlign={['center', 'right']} mt={4} fontSize="sm">Already registered <Link href={"/api/auth/signin"}><a><Text fontSize="sm">sign in?</Text></a></Link></Text>
        </Flex>
      </Flex>
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}