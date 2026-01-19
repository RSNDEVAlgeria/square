type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className="
        w-full p-2 rounded border
        focus:outline-none focus:ring-2 focus:ring-orange-400
        disabled:bg-gray-100
      "
    />
  )
}
