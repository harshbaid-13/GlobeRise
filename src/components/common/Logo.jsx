import PropTypes from "prop-types";
import { useMemo } from "react";

const Logo = ({ variant = "sidebar", showText = false, className = "" }) => {
  const { size, textSize } = useMemo(() => {
    switch (variant) {
      case "header":
        return { size: "w-8 h-8", textSize: "text-lg" };
      case "sidebar":
      default:
        return { size: "w-full h-16 px-2", textSize: "text-xl" };
    }
  }, [variant]);

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className={`${size} rounded-lg overflow-hidden bg-primary flex items-center justify-center shadow`}
      >
        {/* Public assets in Vite are served from the root path */}
        <img
          src="/logo.png"
          alt="GlobeRise"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      {showText && (
        <span className={`${textSize} font-bold text-white tracking-wide`}>
          GlobeRise
        </span>
      )}
    </div>
  );
};

Logo.propTypes = {
  variant: PropTypes.oneOf(["sidebar", "header"]),
  showText: PropTypes.bool,
  className: PropTypes.string,
};

export default Logo;
