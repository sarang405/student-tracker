import Navigation from "./Sidebar";

export default function Layout({ children }) {
  return (
    <Navigation>
      {children}
    </Navigation>
  );
}