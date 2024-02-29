type Props = JSX.IntrinsicElements["button"];

export function Button({ children, ...rest }: Props) {
  return (
    <button type="button" {...rest}>
      {children}
    </button>
  );
}
