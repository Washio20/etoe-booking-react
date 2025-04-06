import AmenityPurchaseHistory from "@/components/AmenityPurchaseHistory";
import ReservationList from "@/components/ReservationList";
import Layout from "@/components/Layout";

export default function ReservationsPage() {
  return (
    <Layout>
      <div className="max-w-[920px] mx-auto py-12">
        <div className="space-y-24">
          <ReservationList />
          <AmenityPurchaseHistory />
        </div>
      </div>
    </Layout>
  );
}
