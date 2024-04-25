import Image from "next/image"

type Props = {}

const Logo = (props: Props) => {
  return (
    <Image
      height={130}
      width={130}
      alt="logoipsum"
      src="/logo.svg"
    />
  )
}

export default Logo