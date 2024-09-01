interface Props {
  children: React.ReactNode;
}

export default function Button({ children }: Props) {
  return <button className="border-4 rounded-md px-6 py-1">{children}</button>;
}
