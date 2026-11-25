import React, { createContext, useContext, useState, useEffect } from "react";

interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // If running in browser, normalize current path
    return window.location.pathname || "/";
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (to.startsWith("http")) {
      window.open(to, "_blank");
      return;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (to !== currentPath) {
      window.history.pushState({}, "", to);
      setCurrentPath(to);
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
};

export const Link: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ href, className, children, title, onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
    if (!href.startsWith("http") && !href.startsWith("#") && !href.startsWith("mailto:")) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a href={href} className={className} title={title} onClick={handleClick}>
      {children}
    </a>
  );
};
