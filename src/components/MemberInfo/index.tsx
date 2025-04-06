"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";

interface MemberFormData {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  gender: "male" | "female" | "";
  fullName: string;
}

export default function MemberInfo() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    gender: "",
    fullName: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [metadataLoaded, setMetadataLoaded] = useState(false);

  // 从cookie获取用户元数据（回退方案）
  const getCookieUserMetadata = () => {
    if (typeof document === "undefined") return null;

    try {
      const cookies = document.cookie.split("; ");
      const userMetadataCookie = cookies.find((cookie) =>
        cookie.startsWith("user_metadata=")
      );

      if (userMetadataCookie) {
        const cookieValue = userMetadataCookie.split("=")[1];
        return JSON.parse(decodeURIComponent(cookieValue));
      }
    } catch (error) {
      console.error("Error parsing user metadata from cookie:", error);
    }

    return null;
  };

  // 使用useCallback包装获取最新用户元数据的函数
  const fetchLatestUserMetadata = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/get-user-metadata");
      if (!response.ok) {
        console.error("Failed to fetch user metadata:", await response.text());
        return;
      }

      const data = await response.json();

      if (data.user_metadata) {
        setFormData((prev) => ({
          ...prev,
          phone: data.user_metadata.phone || prev.phone,
          birthdate: data.user_metadata.birthdate || prev.birthdate,
          gender: data.user_metadata.gender || prev.gender,
          fullName: data.user_metadata.fullName || "", // 只使用元数据中的fullName
        }));
        // 标记元数据已加载
        setMetadataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching user metadata:", error);
    }
  }, [user]);

  // 当获取到Auth0用户信息后，加载表单数据
  useEffect(() => {
    if (user) {
      // 从用户对象或用户元数据中获取信息
      const userMetadata = (user.user_metadata as any) || {};
      // 尝试从cookie获取元数据作为回退
      const cookieMetadata = getCookieUserMetadata() || {};

      // 合并Auth0元数据和cookie中的元数据，Auth0优先
      const combinedMetadata = {
        ...cookieMetadata,
        ...userMetadata,
      };

      // 只使用元数据中的fullName，如果没有则为空字符串
      const displayName = combinedMetadata.fullName || "";

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: combinedMetadata.phone || "",
        birthdate: combinedMetadata.birthdate || "",
        gender: combinedMetadata.gender || "",
        fullName: displayName,
      });

      // 主动获取最新的用户元数据
      fetchLatestUserMetadata();
    }
  }, [user, fetchLatestUserMetadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError("");

    try {
      // 调用API更新用户元数据
      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.sub,
          user_metadata: {
            phone: formData.phone,
            birthdate: formData.birthdate,
            gender: formData.gender,
            fullName: formData.fullName,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("更新用户信息失败");
      }

      // 保存成功
      setSaveSuccess(true);
      setIsEditing(false);
      // 保存成功后重新获取最新的元数据
      fetchLatestUserMetadata();
    } catch (error) {
      console.error("Error updating user metadata:", error);
      setSaveError("ユーザー情報の更新中にエラーが発生しました。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (selectedGender: string) => {
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender as "male" | "female" | "",
    }));
  };

  // 修改处理编辑按钮点击事件，隐藏成功消息
  const handleEditClick = () => {
    setIsEditing(true);
    setSaveSuccess(false);
  };

  // 处理加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-[#444444] font-zen-kaku-gothic">読み込み中...</p>
      </div>
    );
  }

  // 处理未登录状态
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-[#444444] font-zen-kaku-gothic">
          会員情報を表示するには、ログインしてください。
        </p>
        <a
          href="/api/auth/login"
          className="px-6 py-2 bg-[#444444] text-white rounded-full text-sm tracking-wide font-zen-kaku-gothic hover:bg-[#333333] transition-colors"
        >
          ログイン
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-[920px] mx-auto space-y-16">
      {/* 会員情報 */}
      <div className="space-y-6">
        <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
          <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
            会員情報
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {/* メールアドレス */}
            <div className="flex items-center">
              <label
                htmlFor="email"
                className="block text-[#444444] font-zen-kaku-gothic w-1/3"
              >
                メールアドレス
              </label>
              <div className="w-2/3">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic bg-gray-100"
                  disabled={true}
                />
              </div>
            </div>

            {/* お名前（可编辑） */}
            <div className="flex items-center">
              <label
                htmlFor="fullName"
                className="block text-[#444444] font-zen-kaku-gothic w-1/3"
              >
                お名前
              </label>
              <div className="w-2/3">
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic ${
                    !isEditing ? "bg-gray-100" : ""
                  }`}
                  disabled={!isEditing}
                  placeholder="例: 山田 太郎"
                />
              </div>
            </div>

            {/* 電話番号 */}
            <div className="flex items-center">
              <label
                htmlFor="phone"
                className="block text-[#444444] font-zen-kaku-gothic w-1/3"
              >
                電話番号
              </label>
              <div className="w-2/3">
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic ${
                    !isEditing ? "bg-gray-100" : ""
                  }`}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* 生年月日 */}
            <div className="flex items-center">
              <label
                htmlFor="birthdate"
                className="block text-[#444444] font-zen-kaku-gothic w-1/3"
              >
                生年月日
              </label>
              <div className="w-2/3">
                <input
                  id="birthdate"
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className={`w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic ${
                    !isEditing ? "bg-gray-100" : ""
                  }`}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* 性別 */}
            <div className="flex items-center">
              <label className="block text-[#444444] font-zen-kaku-gothic w-1/3">
                性別
              </label>
              <div className="w-2/3 flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={() => handleGenderChange("male")}
                    className="mr-2"
                    disabled={!isEditing}
                  />
                  <span className="text-[#444444] font-zen-kaku-gothic">
                    男性
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={() => handleGenderChange("female")}
                    className="mr-2"
                    disabled={!isEditing}
                  />
                  <span className="text-[#444444] font-zen-kaku-gothic">
                    女性
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 状态消息 */}
          {saveSuccess && (
            <div className="mt-4 p-2 bg-emerald-100 text-emerald-700 rounded text-center">
              会員情報が正常に更新されました。
            </div>
          )}
          {saveError && (
            <div className="mt-4 p-2 bg-red-100 text-red-800 rounded text-center">
              {saveError}
            </div>
          )}

          <div className="mt-8 flex justify-center gap-4">
            {!isEditing ? (
              <button
                type="button"
                onClick={handleEditClick}
                className="px-20 py-3 text-sm font-medium text-white bg-gray-700 rounded-full hover:bg-gray-800 w-72 whitespace-nowrap"
              >
                編集する
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-3 text-sm font-medium text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 text-sm font-medium text-white bg-gray-700 rounded-full hover:bg-gray-800"
                  disabled={isSaving}
                >
                  {isSaving ? "保存中..." : "保存する"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>

      {/* パスワード変更リンク */}
      {/* <div className="max-w-2xl mx-auto text-center">
        <a
          href="/api/auth/logout?returnTo=https://manage.auth0.com/reset-password"
          className="text-[#444444] underline font-zen-kaku-gothic hover:text-gray-600"
        >
          パスワードを変更する
        </a>
      </div> */}
    </div>
  );
}
