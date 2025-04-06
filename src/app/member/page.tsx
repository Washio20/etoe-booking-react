"use client";

import MemberInfo from "@/components/MemberInfo";
import Layout from "@/components/Layout";

export default function MemberPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-8">
        <MemberInfo />
      </div>
    </Layout>
  );
}
