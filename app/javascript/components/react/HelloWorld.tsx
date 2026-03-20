type Props = {
  name: string;
};

export default function HelloWorld({ name }: Props) {
  return <div>Hello, {name}! (React + Vite)</div>;
}
