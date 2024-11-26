import { auth } from "@/auth.config";
import { Title } from "@/components";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div>
      <Title title="Profile" />

      <pre>{JSON.stringify(session?.user, null, 2)}</pre>
    </div>
  );
};

export default ProfilePage;
