import Header from "../../components/Header";
import LoginScreen from "../../components/Login";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <LoginScreen />
      </main>
    </div>
  );
}
