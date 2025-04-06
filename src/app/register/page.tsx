"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function RegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 处理注册
  const handleRegister = () => {
    // 简单验证
    if (
      !password ||
      !confirmPassword ||
      !name ||
      !email ||
      !phone ||
      !birthdate ||
      !gender
    ) {
      setErrorMessage("すべての項目を入力してください。");
      setShowError(true);
      return;
    }

    if (!agreeToTerms) {
      setErrorMessage("利用規約とプライバシーポリシーに同意してください。");
      setShowError(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("パスワードが一致しません。");
      setShowError(true);
      return;
    }

    console.log("注册: ", {
      password,
      name,
      email,
      phone,
      birthdate,
      gender,
      agreeToTerms,
    });
    // 在实际应用中，这里应该有注册逻辑

    // 注册成功后跳转到登录页面
    router.push("/login");
  };

  // 处理输入变化，清除错误
  const handleInputChange = () => {
    if (showError) {
      setShowError(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4 md:py-8 space-y-8">
        <div className="max-w-2xl mx-auto border-b border-[rgba(68,68,68,0.2)] pb-4">
          <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
            新規会員登録
          </h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {showError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-zen-kaku-gothic mb-6">
              {errorMessage}
            </div>
          )}

          {/* 表单输入部分 */}
          <div className="space-y-4">
            {/* お名前 */}
            <div className="flex items-center">
              <label
                htmlFor="name"
                className="block text-[#444444] font-zen-kaku-gothic w-1/3"
              >
                お名前
              </label>
              <div className="w-2/3">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
                />
              </div>
            </div>

            {/* パスワード */}
            <div className="flex items-center">
              <label
                htmlFor="password"
                className="block text-[#444444] font-zen-kaku-gothic w-1/3"
              >
                パスワード
              </label>
              <div className="w-2/3">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
                />
              </div>
            </div>

            {/* パスワード（確認） */}
            <div className="flex items-center">
              <label
                htmlFor="confirmPassword"
                className="block text-[#444444] font-zen-kaku-gothic w-1/3"
              >
                パスワード（確認）
              </label>
              <div className="w-2/3">
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
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
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
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
                  value={birthdate}
                  onChange={(e) => {
                    setBirthdate(e.target.value);
                    handleInputChange();
                  }}
                  className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
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
                    checked={gender === "male"}
                    onChange={() => {
                      setGender("male");
                      handleInputChange();
                    }}
                    className="mr-2"
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
                    checked={gender === "female"}
                    onChange={() => {
                      setGender("female");
                      handleInputChange();
                    }}
                    className="mr-2"
                  />
                  <span className="text-[#444444] font-zen-kaku-gothic">
                    女性
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 利用規約同意 - 脱离space-y-4的限制 */}
          <div className="mt-16 flex justify-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms-agreement"
                checked={agreeToTerms}
                onChange={() => {
                  setAgreeToTerms(!agreeToTerms);
                  handleInputChange();
                }}
                className="w-5 h-5 text-gray-700 accent-gray-700 mr-2"
              />
              <label
                htmlFor="terms-agreement"
                className="text-[#444444] font-zen-kaku-gothic"
              >
                <span>
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#444444] underline"
                  >
                    利用規約
                  </a>{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#444444] underline"
                  >
                    プライバシーポリシー
                  </a>
                  に同意する
                </span>
              </label>
            </div>
          </div>

          {/* 按钮和登录链接 */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleRegister}
              className="px-20 py-3 text-sm font-medium text-white bg-gray-700 rounded-full hover:bg-gray-800 w-72 whitespace-nowrap"
            >
              登録する
            </button>
          </div>

          <div className="mt-4">
            <p className="text-center text-[#444444] font-zen-kaku-gothic">
              すでにアカウントをお持ちの方は
              <a href="/login" className="text-[#444444] underline ml-1">
                ログイン
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
