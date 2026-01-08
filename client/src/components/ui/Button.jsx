export default function Button({ 
  children, 
  onClick, 
  type = "button", 
  href,
  variant = "primary",
  className = "",
  ...props 
}) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-300 inline-block text-center";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 hover:shadow-lg shadow-md",
    secondary: "bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:scale-105 hover:shadow-lg",
    accent: "bg-accent-500 text-white hover:bg-accent-600 hover:scale-105 hover:shadow-lg shadow-md",
    outline: "bg-transparent border-2 border-gray-300 text-gray-700 hover:border-primary-600 hover:text-primary-600 hover:scale-105",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
