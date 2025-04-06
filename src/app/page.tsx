import RoomSelection from "@/components/RoomSelection";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="max-w-[920px] mx-auto py-4 md:py-8 space-y-12">
        <RoomSelection />
      </div>
    </Layout>
  );
}
