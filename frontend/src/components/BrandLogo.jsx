import { Link } from "react-router-dom";

export default function BrandLogo({
  variant = "light", // 'light' (on white/light background) or 'dark' (on navy/dark background)
  size = "md", // 'sm', 'md', 'lg'
  linkTo = "/",
  showTagline = true,
  className = "",
  onClick,
}) {
  const isDark = variant === "dark";

  const sizeStyles = {
    sm: {
      img: "h-11 w-11",
      title: "text-base tracking-tight",
      sub: "text-[10px] tracking-widest",
    },
    md: {
      img: "h-14 w-14",
      title: "text-lg md:text-xl tracking-tight",
      sub: "text-[10px] md:text-xs tracking-widest",
    },
    lg: {
      img: "h-24 w-24",
      title: "text-2xl md:text-3xl tracking-tight",
      sub: "text-xs md:text-sm tracking-widest",
    },
    xl: {
      img: "h-32 w-32",
      title: "text-3xl tracking-tight",
      sub: "text-sm tracking-widest",
    },
  }[size] || {
    img: "h-14 w-14",
    title: "text-lg tracking-tight",
    sub: "text-xs tracking-widest",
  };

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Crisp Logo Mark container */}
      <div className={`relative ${sizeStyles.img} rounded-xl p-0.5 shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-sm bg-white ring-1 ${
        isDark ? "ring-white/20 shadow-md" : "ring-black/10 shadow-slate-100"
      }`}>
        <img
          src="/logo.png"
          alt="Rana Tour And Travels Logo"
          className="w-full h-full object-contain rounded-lg"
        />
      </div>

      {/* Brand Name Typography */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-display font-extrabold uppercase ${isDark ? "text-white" : "text-navy"} ${sizeStyles.title}`}>
            RANA
          </span>
          <span className={`font-display font-semibold text-xs tracking-wider uppercase ${isDark ? "text-gold" : "text-teal"}`}>
            TOURS
          </span>
        </div>
        {showTagline && (
          <span className={`font-semibold uppercase tracking-widest mt-0.5 ${
            isDark ? "text-white/60" : "text-navy/60"
          } ${sizeStyles.sub}`}>
            Himachal Pradesh
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} onClick={onClick} aria-label="Rana Tour And Travels Home" className="inline-block">
        {content}
      </Link>
    );
  }

  return <div onClick={onClick} className={onClick ? "cursor-pointer" : ""}>{content}</div>;
}
