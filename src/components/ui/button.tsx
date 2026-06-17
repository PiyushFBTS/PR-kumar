import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "outline" | "outline-light" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-black text-white hover:bg-black/85",
  secondary: "bg-black text-white hover:bg-black/85",
  outline: "border border-border text-brand hover:bg-surface",
  // For dark backgrounds (hero): white outline that fills white with dark text on hover.
  "outline-light": "border border-white/40 text-white hover:bg-white hover:text-ink",
  ghost: "text-brand hover:bg-surface",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

// Renders an <a> (via next/link) when `href` is provided, else a <button>.
export function Button(
  props: CommonProps &
    ({ href: string } | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })),
) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    ...rest
  } = props as CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
