import Header from "../../components/header";
import LoginScreen from "../../components/login-screen";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <LoginScreen />
      </main>
    </div>
  );
}
