"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function LoginPage() {
  const router = useRouter();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 处理登录
  const handleLogin = () => {
    // 简单验证
    if (!loginId || !password) {
      setErrorMessage("メールアドレスとパスワードを入力してください。");
      setShowError(true);
      return;
    }

    // 模拟登录验证
    if (loginId === "test@gmail.com" && password === "123456") {
      // 登录成功
      console.log("ログイン成功: ", { loginId, password });

      // 存储登录状态
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", loginId);

      // 跳转到首页或预约确认页面
      const reservationInfo = localStorage.getItem("reservationInfo");
      if (reservationInfo) {
        // 如果有预约信息，跳转到预约确认页面
        router.push("/reservation/confirm");
      } else {
        // 否则跳转到首页
        router.push("/");
      }
    } else {
      // 登录失败
      setErrorMessage("メールアドレスまたはパスワードが正しくありません。");
      setShowError(true);
    }
  };

  // 处理输入变化，清除错误
  const handleInputChange = () => {
    if (showError) {
      setShowError(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4 md:py-32 space-y-8">
        {/* <div className="border-b border-[rgba(68,68,68,0.2)] pb-4">
          <h1 className="text-[24px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
            ログイン
          </h1>
        </div> */}

        <div className="max-w-md mx-auto">
          <div className="bg-[#F0EAE4] px-4 py-3 mb-6">
            <h2 className="text-[18px] font-bold text-[#444444] tracking-[0.06em] font-zen-kaku-gothic">
              ログイン
            </h2>
          </div>

          <div className="space-y-6">
            {/* <p className="text-[#444444] font-zen-kaku-gothic">
              ログインIDとパスワードを入力してください。
            </p> */}

            {showError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded font-zen-kaku-gothic">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="loginId"
                className="block text-[#444444] font-zen-kaku-gothic"
              >
                メールアドレス
              </label>
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  handleInputChange();
                }}
                className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
                placeholder="例: test@gmail.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-[#444444] font-zen-kaku-gothic"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  handleInputChange();
                }}
                className="w-full border border-[#BBBBBB] px-4 py-2 rounded-md text-[#444444] font-zen-kaku-gothic"
                placeholder="例: 123456"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleLogin}
                className="px-20 py-3 text-sm font-medium text-white bg-gray-700 rounded-full hover:bg-gray-800 w-72 whitespace-nowrap"
              >
                ログイン
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <p className="text-center text-[#444444] font-zen-kaku-gothic">
                ※パスワードの再設定は
                <a href="#" className="text-[#444444] underline ml-1">
                  こちら
                </a>
              </p>

              <p className="text-center text-[#444444] font-zen-kaku-gothic">
                アカウントをお持ちでない方は
                <a href="/register" className="text-[#444444] underline ml-1">
                  新規登録
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
