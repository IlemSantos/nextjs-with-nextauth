export default async function handler(req, res) {
  const { email, password } = req.body

  const resp = await fetch("http://localhost:4000/auth/signup", {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  }).then(resp => resp.json())

  const { user, error } = resp

  res.status(200).json({ user, error })
}