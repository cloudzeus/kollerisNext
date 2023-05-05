import { getToken } from "next-auth/jwt"

const secret = 'myjwtsecret'

export default async function handler(req, res) {

  const token = await getToken({ req, secret })
  console.log("JSON Web Token", token)
  res.end()
}