export default function TextGradient({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return <p className={`bg-gradient-to-r from-white from-70% to-zone-gold-lite-2 bg-clip-text text-transparent w-fit ${className}`}>{text}</p>;
}
