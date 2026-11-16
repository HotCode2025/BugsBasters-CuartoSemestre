import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-center mt-10 px-4">
      <div className="bg-zinc-800 w-full max-w-md p-10 rounded-md text-center">
        <img
          src={user.gravatar}
          alt={`Avatar de ${user.name}`}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>
    </div>
  );
}