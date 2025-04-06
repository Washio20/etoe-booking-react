import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";
import Layout from "@/components/Layout";

export default async function ProfilePage() {
  const session = await getSession();
  const user = session?.user;

  if (!session || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12">
          <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
            <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              ユーザープロフィール
            </h1>
          </div>

          <div className="mt-8 bg-white p-8 rounded-lg shadow">
            <div className="text-center py-8">
              <p className="text-gray-600 font-zen-kaku-gothic mb-4">
                ログインしていません
              </p>
              <a
                href="/api/auth/login"
                className="px-6 py-2 bg-[#444444] text-white rounded-full text-sm tracking-wide font-zen-kaku-gothic hover:bg-[#333333] transition-colors"
              >
                ログイン
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
          <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
            ユーザープロフィール
          </h1>
        </div>

        <div className="mt-8 bg-white p-8 rounded-lg shadow">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {user.picture && (
                <Image
                  src={user.picture}
                  alt={user.name || "User"}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-[#444444] font-zen-kaku-gothic">
                  {user.name}
                </h2>
                <p className="text-gray-600 font-zen-kaku-gothic">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-[#444444] font-zen-kaku-gothic mb-2">
                アカウント情報
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 font-zen-kaku-gothic">
                    メールアドレス
                  </dt>
                  <dd className="mt-1 text-sm text-[#444444] font-zen-kaku-gothic">
                    {user.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 font-zen-kaku-gothic">
                    ユーザーID
                  </dt>
                  <dd className="mt-1 text-sm text-[#444444] font-zen-kaku-gothic">
                    {user.sub}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 font-zen-kaku-gothic">
                    メール確認状態
                  </dt>
                  <dd className="mt-1 text-sm text-[#444444] font-zen-kaku-gothic">
                    {user.email_verified ? "確認済み" : "未確認"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex justify-center mt-8">
              <a
                href="/api/auth/logout"
                className="px-6 py-2 bg-[#444444] text-white rounded-full text-sm tracking-wide font-zen-kaku-gothic hover:bg-[#333333] transition-colors"
              >
                ログアウト
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
